import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";


export async function getServerSideProps() {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getMasterData"
  );
  const allInvoices = res.data.invoices;
  console.log(allInvoices.length, 'hi');


  return { props: { allInvoices: allInvoices } };
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
}


export default function Home({  allInvoices }: PropTypes) {

  const [date, setDate] = useState<string>((new Date()).toISOString().substr(0, 10));
  const [invoices, setInvoices] = useState<InvoiceType[]>(allInvoices);

  useEffect(() => {
    if(allInvoices?.length){
      const cdate = new Date(date);
      const year = cdate.getFullYear();
      const month = String(cdate.getMonth() + 1).padStart(2, '0');
      const day = String(cdate.getDate()).padStart(2,'0');

      let filteredInvoices = allInvoices.filter((inv:InvoiceType) => inv.date == `${year}-${month}-${day}`);

      setInvoices(filteredInvoices);
    }


  },[date])

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
    if(invoice.second_weight && invoice.second_weight > invoice.first_weight){
      return invoice.second_weight-invoice.first_weight;
    }
    return 0;
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
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </section>

      {invoices?.length && <section id="table">
        <table cellSpacing={10} cellPadding={4} >
            <thead>
                <tr>
                    <th>Broker name</th>
                    <th>Driver Name</th>
                    <th>Vehicle Number</th>
                    <th>Cash</th>
                    <th>Online</th>
                    <th>Total Advance</th>
                    <th>Net Wgt</th>
                    <th>Total Amt</th>
                    <th>Credit</th>
                    <th>Comission</th>
                </tr>
            </thead>
            <tbody>

                {invoices.map((invoice, i) => {

                return <tr key={i}>
                    <td>{invoice.broker_name}</td>
                    <td>{invoice.driver_name}</td>
                    <td>{invoice.vehicle_no}</td>
                    <td>{invoice.cash}</td>
                    <td>{invoice.online}</td>
                    <td>{getTotalAdvance(invoice)}</td>
                    <td>{getNetWeight(invoice)}</td>
                    <td>{getTotalAmount(invoice)}</td>
                    <td>{getBalance(invoice)}</td>
                    <td>{invoice.commission}</td>
                </tr>}
                )}

                <tr>
                    <th colSpan={2}>Total</th>

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