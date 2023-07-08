export interface CompanyItemPageProps {
  companyId: string;
}

export const urlToCompanyItemPage = (props: CompanyItemPageProps) => {
  return `/companies/${props.companyId}`;
};
