const Notification = ({ message, danger }) => {
  if (!message) return null;
  if (danger) {
    return <div className="dangerNotification">{message}</div>;
  } else {
    return <div className="successNotification">{message}</div>;
  }
};

export default Notification;
