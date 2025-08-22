import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";


export async function getServerSideProps() {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getMasterData"
  );
  const allInvoices = res.data.invoices;
  const sheds: string[] = [];

  allInvoices.map((inv: InvoiceType) => {
    if (!sheds.includes(inv.shed)) {
      sheds.push(inv.shed);
    }
  });



  return { props: { allInvoices , sheds } };
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
  allInvoices: InvoiceType[];
  sheds: string[];
}


export default function Home({  allInvoices, sheds }: PropTypes) {

  const [shed, setShed] = useState<string>(sheds[0] ?? "");
  const [startDate, setStartDate] = useState<string>((new Date()).toISOString().substr(0, 10));
  const [endDate, setEndDate] = useState<string>((new Date()).toISOString().substr(0, 10));
  const [invoices, setInvoices] = useState<InvoiceType[]>(allInvoices);

  useEffect(() => {
    if(allInvoices?.length){
      const cdate = new Date(startDate);
      const edate = new Date(endDate);

      // const year = cdate.getFullYear();
      // const eyear = edate.getFullYear();
      // const month = String(cdate.getMonth() + 1).padStart(2, '0');
      // const emonth = String(edate.getMonth() + 1).padStart(2, '0');
      // const day = String(cdate.getDate()).padStart(2,'0');
      // const edat = String(edate.getDate()).padStart(2,'0');

      let filteredInvoices = allInvoices.filter((inv:InvoiceType) => ((new Date(inv.date)) >= cdate  && (new Date(inv.date)) <= edate  && inv.shed == shed));

      setInvoices(filteredInvoices);
    }


  },[startDate, endDate , shed])

  function numberWithCommas(x:number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

    const totalCash = ():number => {
        let totalCash = 0;
        invoices.map((invoice) => totalCash+= (invoice.cash))
        return totalCash;
    }

    const totalOnline = ():number => {
        let totalOnline = 0;
        invoices.map((invoice) => totalOnline+= invoice.online)
        return totalOnline;
    }

    const totalAdvance = ():number => {
        let totalAdvance = 0;
        invoices.map((invoice) => totalAdvance+= getTotalAdvance(invoice));
        return totalAdvance;
    }

    const totalnetwgt = ():number => {
        let totalnetwgt = 0;
        invoices.map((invoice) => totalnetwgt+= getNetWeight(invoice));
        return totalnetwgt;
    }

    const totalamt = ():number => {
        let totalamt = 0;
        invoices.map((invoice) => totalamt+= getTotalAmount(invoice));
        return totalamt;
    }

    const totalbalance = ():number => {

        let totalbalance = 0;
        invoices.map((invoice) => {
          // if(paidCheck) {
          //   if(invoice.paid){
          //     totalbalance+= getBalance(invoice);
          //   }
          // }else{
            totalbalance+= getBalance(invoice);
          // }
        });
        return totalbalance;
    }

    const totalcommission = ():number => {
        let totalcommission = 0;
        invoices.map((invoice) => totalcommission+= invoice.commission);
        return totalcommission;
    }

  const getFinalRate = (invoice: InvoiceType): number => {
    return invoice.todays_rate + invoice.add_less;
  };

  const getTotalAdvance = (invoice:InvoiceType): number => {
    return invoice.online+invoice.cash;
  };
  const getTotalAmount = (invoice:InvoiceType): number => {
    return getFinalRate(invoice) * getNetWeight(invoice);
  };

  const getBalance = (invoice:InvoiceType): number => {
    if(invoice.paid){
      return 0;
    }
    return getTotalAmount(invoice) - getTotalAdvance(invoice);
  };


  const getNetWeight = (invoice:InvoiceType): number => {
    return invoice.second_weight-invoice.first_weight;
  };


  const exportToExcel = async () => {
    if (!invoices?.length) return;
    const XLSX = await import("xlsx");
  
    // Header row exactly as your table
    const headers = [
      "Shed",
      "House no",
      "Date",
      "Broker name",
      "Driver Name",
      "Vehicle Number",
      "Net Wgt",
      "Total Amt",
      "Cash",
      "Online",
      "Total Advance",
      "Credit",
      "Comission", // keep your current spelling
    ];
  
    // Data rows mirroring the table
    const dataRows = invoices.map((inv) => [
      inv.shed,
      inv.house_no,
      inv.date,
      inv.broker_name,
      inv.driver_name,
      inv.vehicle_no,
      getNetWeight(inv),
      getTotalAmount(inv),
      inv.cash,
      inv.online,
      getTotalAdvance(inv),
      getBalance(inv),
      inv.commission,
    ]);
  
    // Totals row aligned to the same columns
    const totalsRow = [
      "Total", // label in first column; blanks for non-numeric columns
      "",
      "",
      "",
      "",
      "",
      totalnetwgt(),
      totalamt(),
      totalCash(),
      totalOnline(),
      totalAdvance(),
      totalbalance(),
      totalcommission(),
    ];
  
    const aoa = [headers, ...dataRows, totalsRow];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
  
    // Optional: nicer widths
    (ws as any)["!cols"] = [
      { wch: 10 }, // Shed
      { wch: 10 }, // House no
      { wch: 12 }, // Date
      { wch: 18 }, // Broker name
      { wch: 16 }, // Driver Name
      { wch: 16 }, // Vehicle Number
      { wch: 10 }, // Net Wgt
      { wch: 12 }, // Total Amt
      { wch: 10 }, // Cash
      { wch: 10 }, // Online
      { wch: 14 }, // Total Advance
      { wch: 10 }, // Credit
      { wch: 12 }, // Comission
    ];
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };
  




  return (
    <>
      <Head>
        <title>Poultry Invoice | Report</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: '100vw', background: '#fff', color: '#000'}}>
      <section className="text-center">
        <h1>Report</h1>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /><br/>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <div>
            <label>Select Shed: </label>
            <select
              name="shed_no"
              className="w-80"
              onChange={(e) => {
                setShed(e.target.value);
              }}
              value={shed}
            >
              {sheds.map((shed, i) => (
                <option key={i} value={shed}>
                  {shed}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={exportToExcel}
              disabled={!invoices?.length}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                cursor: invoices?.length ? "pointer" : "not-allowed",
                background: invoices?.length ? "#f5f5f5" : "#fafafa",
              }}
            >
              Export to Excel
            </button>
          </div>
      </section>

      {invoices?.length && <section id="table">
        <table cellSpacing={10} cellPadding={4} >
            <thead>
                <tr>
                    <th>Shed</th>
                    <th>House no</th>
                    <th>Date</th>
                    <th>Broker name</th>
                    <th>Driver Name</th>
                    <th>Vehicle Number</th>
                    <th>Net Wgt</th>
                    <th>Total Amt</th>
                    <th>Cash</th>
                    <th>Online</th>
                    <th>Total Advance</th>
                    <th>Credit</th>
                    <th>Comission</th>
                </tr>
            </thead>
            <tbody>

                {invoices.map((invoice, i) => {

                return <tr key={i}>
                    <td className="text-center">{invoice.shed}</td>
                    <td className="text-center">{invoice.house_no}</td>
                    <td className="text-center">{invoice.date}</td>
                    <td className="text-center">{invoice.broker_name}</td>
                    <td className="text-center">{invoice.driver_name}</td>
                    <td className="text-center">{invoice.vehicle_no}</td>
                    <td className="text-center">{getNetWeight(invoice)}</td>
                    <td className="text-center">{getTotalAmount(invoice)}</td>
                    <td className="text-center">{invoice.cash}</td>
                    <td className="text-center">{invoice.online}</td>
                    <td className="text-center">{getTotalAdvance(invoice)}</td>
                    <td className="text-center">{getBalance(invoice)}</td>
                    <td className="text-center">{invoice.commission}</td>
                </tr>}
                )}

                <tr>
                    <th colSpan={6} >Total</th>

                    <th>{numberWithCommas(totalCash())}</th>
                    <th>{numberWithCommas(totalOnline())}</th>
                    <th>{numberWithCommas(totalAdvance())}</th>
                    <th>{numberWithCommas(totalnetwgt())}</th>
                    <th>{numberWithCommas(totalamt())}</th>
                    <th>{numberWithCommas(totalbalance())}</th>
                    <th>{numberWithCommas(totalcommission())}</th>
                </tr>

                <tr>
                    <th colSpan={5}>Net Cash</th>
                    <th colSpan={5}>{numberWithCommas(totalamt() + totalcommission() - totalbalance() - totalOnline())}</th>

                </tr>



            </tbody>
        </table>
      </section>}
      </div>
    </>
  );
}