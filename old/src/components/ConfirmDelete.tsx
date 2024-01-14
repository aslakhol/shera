type ConfirmDeleteProps = {
  whatToDelete: string;
  modalId: string;
  deleteAction?: () => void;
};

const ConfirmDelete = (props: ConfirmDeleteProps) => {
  const { whatToDelete, modalId, deleteAction } = props;

  return (
    <>
      <label
        htmlFor={`confirm-delete-modal-${modalId}`}
        className="btn modal-button btn-outline btn-circle btn-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </label>

      <input
        type="checkbox"
        id={`confirm-delete-modal-${modalId}`}
        className="modal-toggle"
      />

      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor={`confirm-delete-modal-${modalId}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <h3 className="text-lg font-bold">Confirm deletion?</h3>

          <ul className="py-4">
            {`Are you sure you want to delete${
              whatToDelete ? " " + whatToDelete : ""
            }?`}
          </ul>

          <div className="modal-action">
            <button className={`btn btn-error`} onClick={deleteAction}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDelete;
