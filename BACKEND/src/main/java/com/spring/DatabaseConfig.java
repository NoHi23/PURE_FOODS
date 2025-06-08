package com.spring;

import com.spring.common.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@PropertySource("classpath:database.properties")
@EnableTransactionManagement
@ComponentScan(basePackages = "com.spring")
@EnableJpaRepositories(basePackages = "com.spring.repository")
public class DatabaseConfig implements Constants.DatabaseConfig {
    private final Environment environment;

    public DatabaseConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(environment.getProperty(JDBC_DRIVER_CLASSNAME, JDBC_DRIVER_CLASSNAME_DEFAULT));
        dataSource.setUrl(environment.getProperty(JDBC_URL));
        dataSource.setUsername(environment.getProperty(JDBC_USERNAME));
        dataSource.setPassword(environment.getProperty(JDBC_PASSWORD));
        return dataSource;
    }

    // JPA EntityManagerFactory (Spring Data JPA)
    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource());
        em.setPackagesToScan("com.spring.entity");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setJpaProperties(hibernateProperties());
        return em;
    }

    @Bean
    public JpaTransactionManager transactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());
        return transactionManager;
    }

    private Properties hibernateProperties() {
        Properties properties = new Properties();
        properties.put(HIBERNATE_DIALECT, environment.getProperty(HIBERNATE_DIALECT));
        properties.put(HIBERNATE_SHOW_SQL, environment.getProperty(HIBERNATE_SHOW_SQL));
        properties.put(HIBERNATE_FORMAT_SQL, environment.getProperty(HIBERNATE_FORMAT_SQL));
        // properties.put("hibernate.hbm2ddl.auto", "update");
        return properties;
    }
}