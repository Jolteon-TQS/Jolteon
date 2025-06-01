package tqs.project.jolteon.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.entities.Operator;
import tqs.project.jolteon.entities.CityAdmin;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;


//TODO: FAZER ISTO DPS
//import tqs.project.jolteon.exceptions.InvalidCredentialsException;
//import tqs.project.jolteon.exceptions.UserNotFoundException;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;





@Service
public class AuthService {

    private final NormalUserService normalUserService;
    private final OperatorService operatorService;
    private final CityAdminService cityAdminService;


    public AuthService(NormalUserService normalUserService, 
                       OperatorService operatorService, 
                       CityAdminService cityAdminService) {
        this.normalUserService = normalUserService;
        this.operatorService = operatorService;
        this.cityAdminService = cityAdminService;
    }

    // Método para registrar um novo NormalUser
    public NormalUser registerPatient(NormalUser user) {
        if (normalUserService.getNormalUserByEmail(user.getEmail()) instanceof NormalUser) {
            throw new IllegalArgumentException("Email already in use by another user: " + user.getEmail());
        }
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt())); // Hash da senha
        return normalUserService.addNormalUser(user);
    }


    // Método para registrar um novo Operador
    public Operator registerOperator(Operator operator) {
        if (operatorService.getOperatorByEmail(operator.getEmail()) instanceof Operator) {
            throw new IllegalArgumentException("Email already in use by another operator: " + operator.getEmail());
        }
        operator.setPassword(BCrypt.hashpw(operator.getPassword(), BCrypt.gensalt())); // Hash da senha
        return operatorService.addOperator(operator);
    }

    // Método para registrar um novo CityAdmin
    public CityAdmin registerCityAdmin(CityAdmin cityAdmin) {
        if (cityAdminService.getCityAdminByEmail(cityAdmin.getEmail()) instanceof CityAdmin) {
            throw new IllegalArgumentException("Email already in use by another city admin: " + cityAdmin.getEmail());
        }
        cityAdmin.setPassword(BCrypt.hashpw(cityAdmin.getPassword(), BCrypt.gensalt())); // Hash da senha
        return cityAdminService.addCityAdmin(cityAdmin);
    }

    // Método para login de NormalUsers
    public String loginNormalUser(String email, String password) {
        NormalUser user = normalUserService.getNormalUserByEmail(email);

        // if (user == null || !BCrypt.checkpw(password, user.getPassword())) {
        //     throw new InvalidCredentialsException("Invalid credentials for user: " + email);
        // }

        return generateAuthToken(user);
    }

    public String loginCityAdminOrNormalUSerOrOperator(String email, String password){
        CityAdmin admin = cityAdminService.getCityAdminByEmail(email);
        if (admin instanceof CityAdmin) {
            if (BCrypt.checkpw(password, admin.getPassword())) {
                return generateAuthToken(admin);
            } else {
                throw new InvalidCredentialsException("Invalid password for city admin: " + email);
            }
        }
        Operator operator = operatorService.getOperatorByEmail(email);
        if (operator instanceof Operator) {
            if (BCrypt.checkpw(password, operator.getPassword())) {
                return generateAuthToken(operator);
            } else {
                throw new InvalidCredentialsException("Invalid password for operator: " + email);
            }
        }
        NormalUser normaluser = normalUserService.getNormalUserByEmail(email);
        if (normaluser instanceof NormalUser) {
            if (BCrypt.checkpw(password, normaluser.getPassword())) {
                return generateAuthToken(normaluser);
            } else {
                throw new InvalidCredentialsException("Invalid password for normal user: " + email);
            }
        }
        throw new UserNotFoundException("User not found with email: " + email);

    }


    private static final String SECRET_KEY = "batatafrita12cavalo34onthefloor5x5256x636";

    public String generateAuthToken(NormalUser user) {
        SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("userType", "normaluser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 horas
                .signWith(secretKey, SignatureAlgorithm.HS256) // Use a chave segura
                .compact();
    }

    public String generateAuthToken(Operator operator) {
        SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
                .setSubject(operator.getEmail())
                .claim("id", operator.getId())
                .claim("userType", "operator")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 horas
                .signWith(secretKey, SignatureAlgorithm.HS256) // Use a chave segura
                .compact();
    }


    public String generateAuthToken(CityAdmin cityadmin) {
        SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
                .setSubject(cityadmin.getEmail())
                .claim("id", cityadmin.getId())
                .claim("userType", "cityadmin")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 horas
                .signWith(secretKey, SignatureAlgorithm.HS256) // Use a chave segura
                .compact();
    }

    public Claims parseAuthToken(String token) {
        SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS256.getJcaName());
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
        return claimsJws.getBody();
    }

    public String getUserTypeFromToken(String token) {
        Claims claims = parseAuthToken(token);
        return claims.get("userType", String.class); // Recupera o userType
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseAuthToken(token);
        return claims.get("id", Long.class); // Recupera o id
    }

    public Boolean isTokenValid(String token) {
        try {
            parseAuthToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    

}