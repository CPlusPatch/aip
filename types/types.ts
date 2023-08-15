export enum UISettingType {
	Image = "image",
	Text = "text",
	Toggle = "toggle",
	Navbar = "navbar",
	Footer = "footer",
}

export interface UISetting {
	name: string;
	type: UISettingType;
	value: any;
	title: string;
	text: string;
	icon?: string;
}
