import BasicModal from "./basic-modal";

interface AlertModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	type?: "cancelAndConfirm";
}

export default function AlertModal({ open, onClose, onConfirm, loading, type }: AlertModalProps) {
	return (
		<BasicModal
			title="¿Estás seguro?"
			description="Esta acción no se puede deshacer"
			type={type}
			open={open}
			onClose={onClose}
			loading={loading}
			onConfirm={onConfirm}
		/>
	);
}
