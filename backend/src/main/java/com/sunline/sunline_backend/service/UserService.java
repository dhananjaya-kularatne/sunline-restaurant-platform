package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import com.sunline.sunline_backend.entity.MenuItem;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import java.util.Set;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    public List<User> getAllUsers(String search) {
        if (search != null && !search.isEmpty()) {
            return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search);
        }
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, User.Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(user.getActive() == null || !user.getActive());
        return userRepository.save(user);
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        boolean isActive = user.getActive() == null || user.getActive();

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                isActive,
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User registerUser(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(User.Role.CUSTOMER)
                .build();

        return userRepository.save(user);
    }

    public void createPasswordResetToken(String email) {
        User user = findByEmail(email);
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        emailService.sendEmail(user.getEmail(), "Password Reset", "Click here to reset: " + resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        validateResetToken(token);
        User user = userRepository.findByResetToken(token).get();

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public void validateResetToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or non-existent reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("The password reset link has expired");
        }
    }

    public Set<MenuItem> getWishlist(String email) {
        return findByEmail(email).getWishlist();
    }

    public void addToWishlist(String email, Long menuItemId) {
        User user = findByEmail(email);
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        user.getWishlist().add(item);
        userRepository.save(user);
    }

    public void removeFromWishlist(String email, Long menuItemId) {
        User user = findByEmail(email);
        user.getWishlist().removeIf(item -> item.getId().equals(menuItemId));
        userRepository.save(user);
    }

    public User updateProfile(String email, String name, String bio) {
        User user = findByEmail(email);
        if (name != null)
            user.setName(name);
        if (bio != null)
            user.setBio(bio);
        return userRepository.save(user);
    }

    public User updateProfilePicture(String email, String filePath) {
        User user = findByEmail(email);
        user.setProfilePicture(filePath);
        return userRepository.save(user);
    }

    public String saveProfilePicture(String email, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new RuntimeException("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        updateProfilePicture(email, fileName);
        return fileName;
    }
}
