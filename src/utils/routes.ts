export interface ICompanyItemPageProps {
  companyId: string;
}

export const urlToCompanyItemPage = (props: ICompanyItemPageProps) => {
  return `/companies/${props.companyId}`;
};
