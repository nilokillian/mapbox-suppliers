import styles from "../styles/MapboxSuppliers.module.scss";

export interface ISuppliersDetailsProps {
  contact: string;
  email: string;
  mobile: string;
  landline: string;
  address: string;
}

export const useSupplierDetails = (props: ISuppliersDetailsProps): string => {
  const html = `

  <div class=${styles.supplierDetails}>
   ${props.contact}
  </div>

  <div class=${styles.supplierDetails}>
   <i class="ms-Icon ms-Icon--CellPhone" aria-hidden="true"> : ${props.mobile}</i>
  </div>

  <div class=${styles.supplierDetails}>
   <i class="ms-Icon ms-Icon--Phone" aria-hidden="true"> : ${props.landline}</i>
  </div>

  <div class=${styles.supplierDetails}>
    <i class="ms-Icon ms-Icon--Mail" aria-hidden="true">
     <a style="text-decoration: none" href="mailto: ${props.email}"> : send email</a>
    </i> 
  </div>`;

  return html;
};
