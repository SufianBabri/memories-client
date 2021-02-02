import React from 'react';
import { Box, Tooltip, IconButton } from '@material-ui/core';

interface Props {
	label?: string;
	tooltip: string;
	ariaLabel: string;
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ActionButton({
	label,
	tooltip,
	ariaLabel,
	children,
	onClick,
}: Props) {
	return (
		<Tooltip title={tooltip} placement="top">
			<Box>
				<IconButton
					aria-label={ariaLabel}
					color="primary"
					onClick={onClick}>
					{children}
				</IconButton>
				{label}
			</Box>
		</Tooltip>
	);
}
