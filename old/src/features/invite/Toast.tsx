type ToastProps = { display: boolean };

const Toast = (props: ToastProps) => {
  const { display } = props;

  return (
    <>
      <div
        className={`toast toast-end fixed bottom-2 transition-opacity duration-300 ease-out animate-bounce ${
          display ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="alert alert-info">
          <div>
            <span>Link copied, now share it with your friends!</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toast;
