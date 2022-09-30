import { ReactNode } from "react";

type ModalProps = {
  buttonText: string;
  title: string;
  modalId: string;
  children: ReactNode;
};

const Modal = (props: ModalProps) => {
  const { buttonText, title, modalId, children } = props;

  return (
    <>
      <label htmlFor={modalId} className="btn modal-button btn-outline">
        {buttonText}
      </label>

      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor={modalId}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">{title}</h3>
          <ul className="py-4">{children}</ul>
        </div>
      </div>
    </>
  );
};

export default Modal;
