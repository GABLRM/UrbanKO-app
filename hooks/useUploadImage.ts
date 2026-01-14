import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export function useUploadImage() {
    return useMutation({
        mutationFn: async (data: {
            userId: string;
            imageInfo: { uri: string; name: string; mimetype: string };
        }) => {
            const token = await SecureStore.getItemAsync('token');

            const formData = new FormData();

            formData.append('image', {
                uri: data.imageInfo.uri,
                name: data.imageInfo.name,
                type: data.imageInfo.mimetype,
            } as unknown as Blob);

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/bucket/image/${data.userId}/${data.imageInfo.name}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                },
            );

            let url = await response.text();

            if (url.includes('http://localhost:3000') && !!process.env.EXPO_PUBLIC_API_URL) {
                url = url.replace('http://localhost:3000', process.env.EXPO_PUBLIC_API_URL ?? '');
            }

            return url;
        },
    });
}
