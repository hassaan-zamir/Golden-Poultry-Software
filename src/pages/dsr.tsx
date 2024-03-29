import Head from "next/head";
import axios from "axios";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

export async function getServerSideProps() {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getMasterData"
  );
  const invoices = res.data.invoices;
  const sheds:string[] = [];

  invoices.map((inv: InvoiceType) => {
    if (!sheds.includes(inv.shed)){
      sheds.push(inv.shed)
    }
  })

  return { props: { invoices, sheds } };
}

export interface InvoiceType {
  add_less: number;
  broker_name: string;
  cash: number;
  commission: number;
  date: string;
  driver_name: string;
  first_weight: number;
  house_no: string;
  id: number;
  online: number;
  paid: number;
  second_weight: number;
  shed: string;
  todays_rate: number;
  vehicle_no: string;
}

interface PropTypes {
  invoices: InvoiceType[];
  sheds: string[];
}

export default function Home({ invoices, sheds }: PropTypes) {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [date, setDate] = useState<string>(
    new Date().toISOString().substr(0, 10)
  );
  const [shed, setShed] = useState<string>(sheds[0] ?? "");
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>([]);

  const fetchInvoices = () => {
    setFilteredInvoices([]);
    if (invoices?.length) {
      const cdate = new Date(date);
      const year = cdate.getFullYear();
      const month = String(cdate.getMonth() + 1).padStart(2, "0");
      const day = String(cdate.getDate()).padStart(2, "0");

      let filteredInvoices = invoices.filter(
        (inv) => inv.date === `${year}-${month}-${day}` && inv.shed === shed
      );
      setFilteredInvoices(filteredInvoices);

      if (filteredInvoices.length > 0) {
        toast.error("No invoices found");
      }
    } else {
      toast.error("No Invoices Found");
    }
  };

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }



  const getFinalRate = (invoice: InvoiceType): number => {
    return invoice.todays_rate + invoice.add_less;
  };

  const getTotalAdvance = (invoice: InvoiceType): number => {
    return invoice.online + invoice.cash;
  };

  const getNetWeight = (invoices: InvoiceType[]): number => {
    let sum = 0;
    invoices.map((inv) => {
      
        if(inv.second_weight && inv.second_weight > inv.first_weight){
          sum+= inv.second_weight-inv.first_weight;
        }
       
    })
    return sum;
  };

  const getTotalAmount = (invoices: InvoiceType[]): number => {
    let sum = 0;
    invoices.map((inv) => {
      sum += getFinalRate(inv) * (inv.second_weight - inv.first_weight);
    });
    return sum;
  };

  const getBalance = (invoices: InvoiceType[]): number => {
    let sum = 0;
    invoices.map((inv) => {
      if(!inv.paid){
        sum+= ((getFinalRate(inv) * (inv.second_weight - inv.first_weight)) - getTotalAdvance(inv));
      }
    })

    return sum;
  };

  const getTotalCommission = (invoices: InvoiceType[]): number => {
    let sum = 0;
    invoices.map(inv => {
      sum+= inv.commission;
    }); 
    return sum;
  }

  const totalOnline = (invoices: InvoiceType[]): number => {
    let sum = 0;
    invoices.map(inv => {
      sum+=inv.online;
    })
    return sum;
  }

  const getNetCash = (invoices: InvoiceType[]): number => {
    return getTotalAmount(invoices)+getTotalCommission(invoices)-getBalance(invoices)-totalOnline(invoices);
  }

  return (
    <>
      <Head>
        <title>Poultry Invoice | Report</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100vw", background: "#fff", color: "#000", textAlign: 'center' }}>
        <h1>Report</h1>
        <section
          className="text-center"
          style={{ display: "flex", justifyContent: "center", gap: "10px" }}
        >
          <input
            type="date"
            className="w-80"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <br />
          <select
            name="shed_no"
            className="w-80"
            onChange={(e) => {
              setShed(e.target.value);
            }}
            defaultValue={shed}
          >
            {sheds.map((shed, i) => (
              <option key={i} value={shed}>
                {shed}
              </option>
            ))}
          </select>
          <button onClick={fetchInvoices}>Submit</button>
          {filteredInvoices.length > 0 && (
            <button onClick={handlePrint}>Print</button>
          )}
        </section>

        <section style={{ background: "white", color: "black" }}>
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
                  <h2>
                    GOLDEN POULTRY
                    <br />
                    FARMS
                  </h2>
                </th>
              </tr>

              <tr>
                <th colSpan={4}>DSR</th>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Date</b>
                  <br />
                  <span>{new Date(date).toISOString().substr(0, 10)}</span>
                </td>

                <td colSpan={2}>
                  <b>Shed</b>
                  <br />
                  <span>{shed}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Total Weight</b>
            
                </td>

                <td colSpan={2}>
                  <span>{numberWithCommas(getNetWeight(filteredInvoices))}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Total Sales</b>
                </td>

                <td colSpan={2}>
                  <span>{numberWithCommas(getTotalAmount(filteredInvoices))}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Total Online</b>
                </td>

                <td colSpan={2}>
                  <span>{numberWithCommas(totalOnline(filteredInvoices))}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Total Credit</b>
                </td>

                <td colSpan={2}>
                  <span>{numberWithCommas(getBalance(filteredInvoices))}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Total Commission</b>
                </td>

                <td colSpan={2}>
                  <span>{numberWithCommas(getTotalCommission(filteredInvoices))}</span>
                </td>
              </tr>


              <tr>
                <td>&nbsp;</td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <b>Net Cash</b>
                </td>

                <td colSpan={2}>
                  <span>{numberWithCommas(getNetCash(filteredInvoices))}</span>
                </td>
              </tr>


              <tr>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </section>


      </div>

    </>
  );
}
