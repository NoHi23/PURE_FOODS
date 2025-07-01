    package com.spring.service.Impl;

    import com.spring.dao.NotificationDAO;
    import com.spring.entity.Notifications;
    import com.spring.service.NotificationService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Propagation;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.List;
    @Service
    @Transactional(propagation = Propagation.REQUIRED)
    public class NotificationServiceImpl implements NotificationService {
        @Autowired
        private NotificationDAO dao;

        public List<Notifications> unread(int uid) {
            return dao.getUnreadNotificationsByUserId(uid);
        }
        public void read(int id) {
            dao.markAsRead(id);
        }
        public List<Notifications> all(int uid) {
            return dao.getAllNotificationsByUserId(uid);
        }

        @Override
        public int markAllAsRead(int userId) {
            dao.markAllUnreadAsReadByUserId(userId);
            return 0;
        }
    }
