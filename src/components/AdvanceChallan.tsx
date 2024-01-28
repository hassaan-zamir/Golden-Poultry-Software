
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { InvoiceType } from "@/pages/home";
import { useReactToPrint } from "react-to-print";

interface AdvanceChallanPropTypes {
    invoice: InvoiceType | null,
    printInvoice: boolean,
    setPrintInvoice: Dispatch<SetStateAction<boolean>>,
}

export default function AdvanceSlip({ invoice, printInvoice, setPrintInvoice }: AdvanceChallanPropTypes) {

  const componentRef = useRef(null);

  useEffect(() => {
    if(printInvoice === true){
        handlePrint();
        setPrintInvoice(false);
    }
  }, [printInvoice])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getChallanNo = (d: string, id: number): string => {
    const date = new Date(d);
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}-${id}`;
  };



  if (!invoice) {
    return <></>;
  }

  return (
    <section style={{ background: 'white', color: 'black'}}>
      <table
        className="print-table"
        ref={componentRef}
        style={{
          textAlign: "center",
          background: "#fff",
          color: "#000",
          border: "none",
        }}
        border={0}
        cellSpacing={10}
      >
        <tbody>
          <tr>
            <th colSpan={4}>
              <h2>GOLDEN POULTRY<br/>FARMS</h2>
            </th>
          </tr>
    
          <tr>
            <th colSpan={4}>Advance Slip</th>
          </tr>
          
          <tr>
            <td colSpan={2}>
              <b>Date</b>
              <br />
              <span>{new Date(invoice.date).toISOString().substr(0, 10)}</span>
            </td>

            <td colSpan={2}>
              <b>Challan#</b>
              <br />
              <span>{getChallanNo(invoice.date, invoice.id)}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Shed</b>
              <br />
              <span>{invoice.shed}</span>
            </td>

            <td colSpan={2}>
              <b>Broker</b>
              <br />
              <span>{invoice.broker_name}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Vehicle</b>
              <br />
              <span>{invoice.vehicle_no}</span>
            </td>

            <td colSpan={2}>
              <b>Driver</b>
              <br />
              <span>{invoice.driver_name}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Cash</b>
              <br />
              <span>{invoice.cash}</span>
            </td>

            <td colSpan={2}>
              <b>Online</b>
              <br />
              <span>{invoice.online}</span>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>

          <tr>
            <td colSpan={4}>
              <b>Total Advance</b>
              <br />
              <span>{invoice.cash + invoice.online}</span>
            </td>
          </tr>

          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>

    </section>
  );
}
