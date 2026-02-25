import { useEffect, useState } from "react";

export function usePersistendState<T>(key: string, initial: T): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => {
		try {
			const raw = localStorage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : initial;
		} catch {
			return initial;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.log(e);
		}
	}, [key, value]);

	return [value, setValue] as const;
}
