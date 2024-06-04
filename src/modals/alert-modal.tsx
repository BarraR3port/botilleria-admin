"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";

interface AlertModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

export default function AlertModal({ open, onClose, onConfirm, loading }: AlertModalProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null;
	}

	return (
		<Modal title="¿Estás seguro?" description="Esta acción no se puede deshacer" open={open} onClose={onClose}>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button variant="secondary" onClick={onClose} disabled={loading}>
					Cancelar
				</Button>
				<Button variant="destructive" onClick={onConfirm} loading={loading}>
					Eliminar
				</Button>
			</div>
		</Modal>
	);
}
