import * as React from "react";
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardTitle,
  DocumentCardDetails,
  IDocumentCardPreviewProps,
  DocumentCardPreview,
  Stack,
  Separator,
  IconButton
} from "office-ui-fabric-react";
// import { IMappedSupliers } from "./interfaces/Interfaces";
import styles from "./MapboxSuppliers.module.scss";

export const SupplierDetails = (props): JSX.Element => {
  const previewProps: IDocumentCardPreviewProps = {
    getOverflowDocumentCountText: (overflowCount: number) =>
      `+${overflowCount} more`,
    previewImages: [
      {
        name: props.postcode,
        width: 318,
        height: 196
      },
      {
        name: props.address_1,
        width: 318,
        height: 196
      },
      {
        name: props.address_2,
        width: 318,
        height: 196
      }
    ]
  };
  const _sendEmail = () => {
    window.location.href = `mailto:${props.email ? props.email : ""}`;
  };

  return (
    <DocumentCard style={{ marginTop: 14 }}>
      <DocumentCardDetails>
        <DocumentCardTitle
          title={
            props.additional
              ? `${props.companyName}  ${props.additional}`
              : props.companyName
          }
          shouldTruncate={true}
        />
        <DocumentCardActivity
          activity="account manager"
          people={[
            {
              name: props.accountManager,
              profileImageSrc: "templateImage.icon"
            }
          ]}
        />
      </DocumentCardDetails>
      <Stack horizontal horizontalAlign="center">
        <Stack verticalAlign="center">
          <div>
            <div className={styles.supplierDetails}>
              <IconButton iconProps={{ iconName: "CellPhone" }} />
              <span>{`:  ${props.mobile}`}</span>
            </div>
          </div>

          <div>
            <div className={styles.supplierDetails}>
              <IconButton iconProps={{ iconName: "Phone" }} />
              <span>{`:  ${props.landLinePhone}`}</span>
            </div>
          </div>

          <div>
            <div className={styles.supplierDetails}>
              <IconButton
                onClick={_sendEmail}
                iconProps={{ iconName: "NewMail" }}
              />
              <span>{`:  ${props.email}`}</span>
            </div>
          </div>
        </Stack>
      </Stack>
      <Separator />
      <DocumentCardPreview {...previewProps} />
    </DocumentCard>
  );
};
