/* eslint-disable @next/next/no-css-tags */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { InvoiceType } from "../home";
import Head from "next/head";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";

export default function DeliveryChallan() {
  const router = useRouter();
  const componentRef = useRef(null);

  const [invoice, setInvoice] = useState<InvoiceType | null>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getChallanNo = (d: string, id: number): string => {
    const date = new Date(d);
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}-${id}`;
  };
  const fetchInvoice = async (id: string | string[] | undefined) => {
    if (!id) return;

    try {
      const resp = await axios.post("/api/getInvoice", { id: id });
      setInvoice(resp.data.invoice);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchInvoice(router.query.id);
  }, [router]);

  if (!invoice) {
    return <p>Please wait...</p>;
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/posPrint.css" />
      </Head>
      <button onClick={handlePrint} className="printBtn">Print this out!</button>
      <table
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
            <th colSpan={4}>Delivery Challan</th>
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
              <b>1st Wgt</b>
              <br />
              <span>{invoice.first_weight}</span>
            </td>

            <td colSpan={2}>
              <b>2nd Wgt</b>
              <br />
              <span>{invoice.second_weight}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Net wgt</b>
              <br />
              <span>{invoice.second_weight - invoice.first_weight}</span>
            </td>

            <td colSpan={2}>
              <b>Rate</b>
              <br />
              <span>{invoice.todays_rate + invoice.add_less}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Total Amt</b>
              <br />
              <span>{(invoice.todays_rate + invoice.add_less)*(invoice.second_weight - invoice.first_weight)}</span>
            </td>

            <td colSpan={2}>
              <b>Cash</b>
              <br />
              <span>{invoice.cash}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Total Advance</b>
              <br />
              <span>{(invoice.cash + invoice.online)}</span>
            </td>

            <td colSpan={2}>
              <b>Online</b>
              <br />
              <span>{invoice.online}</span>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <b>Balance</b>
              <br />
              <span>{((invoice.todays_rate + invoice.add_less)*(invoice.second_weight - invoice.first_weight))-(invoice.cash + invoice.online)}</span>
            </td>

            <td colSpan={2}>
              <b>Commission</b>
              <br />
              <span>{invoice.commission}</span>
            </td>
          </tr>

        
          <tr>
            <td>&nbsp;</td>
          </tr>

          <tr>
            <td colSpan={4}>
              <b>Credit Amt</b>
              <br />
              <span>{
               invoice.paid? 0 : (((invoice.todays_rate + invoice.add_less)*(invoice.second_weight - invoice.first_weight))-(invoice.cash + invoice.online) + invoice.commission)
              }</span>
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
      
    </>
  );
}
