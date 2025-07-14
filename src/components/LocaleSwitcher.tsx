import { useTranslation } from "react-i18next";
import { Select, SelectItem } from "@heroui/react";
import { supportedLanguages } from "../i18n/config";
import { ComponentProps } from "react";

export default function LocaleSwitcher({
  ...props
}: Omit<ComponentProps<typeof Select>, "children">) {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Select
      {...props}
      label={t("settings.localeSwitcher.label")}
      placeholder={t("settings.localeSwitcher.placeholder")}
      selectedKeys={[i18n.resolvedLanguage ?? "en_US"]}
      onChange={handleLanguageChange}
    >
      {Object.entries(supportedLanguages).map(([code, name]) => (
        <SelectItem key={code}>{name}</SelectItem>
      ))}
    </Select>
  );
}
