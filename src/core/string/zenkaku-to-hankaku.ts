export default function(str: string): string {
	return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
}
