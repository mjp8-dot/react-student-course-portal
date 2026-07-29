import {
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoWarningOutline,
    IoHelpCircleOutline
} from "react-icons/io5";

const icons = {
    success: IoCheckmarkCircleOutline,
    error: IoCloseCircleOutline,
    warning: IoWarningOutline,
    confirm: IoHelpCircleOutline
};

export default function Modal(props) {

    if (!props.isOpen) return null;

    const type = props.type || "success";
    const Icon = icons[type];
    const isConfirm = type === "confirm";

    return (
        <div className="modalOverlay" onClick={props.onCancel || props.onConfirm}>

            <div className="modalCard card" onClick={(e) => e.stopPropagation()}>

                <Icon className={`modalIcon ${type}`} />

                <h3 className="modalTitle">{props.title}</h3>

                {props.message && <p className="modalMessage">{props.message}</p>}

                <div className="modalActions">

                    {isConfirm && (
                        <button className="modalBtn secondary" onClick={props.onCancel}>
                            {props.cancelText || "Cancel"}
                        </button>
                    )}

                    <button className={`modalBtn primary ${type}`} onClick={props.onConfirm}>
                        {props.confirmText || "OK"}
                    </button>

                </div>

            </div>

        </div>
    );
}
