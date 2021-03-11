const BYTES_IN_ONE_MEGA_BYTE = 1000000;

export function isFileBiggerThan2MB(file: File) {
	return file.size > 2 * BYTES_IN_ONE_MEGA_BYTE;
}

export function readImageAsBase64Data(file: File): Promise<string> {
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onload = () => {
			const imageData = reader.result?.toString() ?? '';
			resolve(imageData);
		};

		reader.onerror = (error) => {
			console.error('Error reading file', error);
			reject(error);
		};

		reader.readAsDataURL(file);
	});
}
