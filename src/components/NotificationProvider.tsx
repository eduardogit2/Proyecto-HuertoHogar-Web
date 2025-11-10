import { useNotification } from '../context/NotificationContext';

const notificationContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div style={notificationContainerStyle}>
      {notifications.map(notification => {
        let alertClass = 'alert-info';
        if (notification.type === 'success') alertClass = 'alert-success';
        if (notification.type === 'error') alertClass = 'alert-danger';

        return (
          <div
            key={notification.id}
            className={`alert ${alertClass} alert-dismissible fade show shadow-sm`}
            role="alert"
            style={{ minWidth: '300px' }}
          >
            {notification.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Cerrar"
            ></button>
          </div>
        );
      })}
    </div>
  );
}