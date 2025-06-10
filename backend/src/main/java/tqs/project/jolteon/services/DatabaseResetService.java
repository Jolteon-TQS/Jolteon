package tqs.project.jolteon.services;

import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
// import jakarta.annotation.Generated;

// @Generated("excluded from coverage")
@Service
public class DatabaseResetService {

    private final DataSource dataSource;

    public DatabaseResetService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void resetDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (Statement stmt = conn.createStatement()) {
                stmt.execute("SET session_replication_role = replica");

                List<String> tables = new ArrayList<>();
                try (ResultSet rs = stmt.executeQuery(
                        "SELECT tablename FROM pg_tables WHERE schemaname = 'public'")) {
                    while (rs.next()) {
                        tables.add(rs.getString("tablename"));
                    }
                }

                for (String table : tables) {
                    stmt.executeUpdate("TRUNCATE TABLE " + table + " CASCADE");
                }

                stmt.execute("SET session_replication_role = DEFAULT");
            }

            ScriptUtils.executeSqlScript(conn, new ClassPathResource("reset_and_seed.sql"));

            conn.commit();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to reset and seed database", e);
        }
    }
}
