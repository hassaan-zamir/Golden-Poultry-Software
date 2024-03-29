import Head from "next/head";
import axios from "axios";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { BrokerType, InvoiceType } from "./home";
import Link from "next/link";

export async function getServerSideProps() {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getMasterData"
  );
  const invoices = res.data.invoices;
  const brokers = res.data.brokers;
  const sheds: string[] = [];

  invoices.map((inv: InvoiceType) => {
    if (!sheds.includes(inv.shed)) {
      sheds.push(inv.shed);
    }
  });

  return { props: { invoices, sheds, brokers } };
}

interface PropTypes {
  invoices: InvoiceType[];
  sheds: string[];
  brokers: BrokerType[];
}

export default function CreditReport({ invoices, sheds, brokers }: PropTypes) {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [startingDate, setStartingDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [endingDate, setEndingDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  const [brokerName, setBrokerName] = useState<string>(
    brokers?.[0]?.name ?? ""
  );

  const [isSummary, setIsSummary] = useState<boolean>(false);

  const [shed, setShed] = useState<string>(sheds[0] ?? "");
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>([]);

  const dateCheck = (
    actualDate: string,
    startDate: string,
    endingDate: string
  ): boolean => {
    const actual = new Date(actualDate);
    const start = new Date(startDate);
    const end = new Date(endingDate);

    return actual >= start && actual <= end;
  };

  const getFinalRate = (invoice: InvoiceType): number => {
    return invoice.todays_rate + invoice.add_less;
  };

  const getTotalAdvance = (invoice:InvoiceType): number => {
    return invoice.online+invoice.cash;
  };
  const getTotalAmount = (invoice:InvoiceType): number => {
    return getFinalRate(invoice) * getNetWeight(invoice);
  };

  const getCredit = (invoice:InvoiceType): number => {
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

  const calculateCredit = (invoices: InvoiceType[]) => {
    let summary:Record<string,number> = {};
    invoices.map(invoice => {
      const old = summary[invoice.date.substring(0, 10)] ??  0;
      summary[invoice.date.substring(0, 10)] = old + getCredit(invoice);
    });
    return summary;
  };

  const fetchInvoices = () => {
    setFilteredInvoices([]);
    if (invoices?.length) {
      let filteredInvoices = invoices.filter(
        (inv) =>
          dateCheck(inv.date, startingDate, endingDate) &&
          inv.shed === shed &&
          (inv.broker_name === brokerName || brokerName === "allbroker")
      );

      filteredInvoices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setFilteredInvoices(filteredInvoices);

      if (filteredInvoices.length === 0) {
        toast.error("No invoices found");
      }
    } else {
      toast.error("No Invoices Found");
    }
  };

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getTotalCredit = (invoices: InvoiceType[]): number => {
    let total = 0;
    invoices.map((invoice) => {
      total+= getCredit(invoice)
    });
    return total;
  };

  return (
    <>
      <Head>
        <title>Poultry Invoice | Credit Report</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/" style={{ color: "white", fontWeight: "900" }}>
        Go Back
      </Link>

      <div
        style={{
          width: "100vw",
          background: "#fff",
          color: "#000",
          textAlign: "center",
        }}
      >
        <h1>Credit Report</h1>
        <section
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          <div>
            <label>Start Date: </label>
            <input
              type="date"
              className="w-80"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
            />
          </div>

          <div>
            <label>End Date: </label>
            <input
              type="date"
              className="w-80"
              value={endingDate}
              onChange={(e) => setEndingDate(e.target.value)}
            />
          </div>

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

          <div>
            <label>Select Broker:</label>
            <select
              name="broker"
              className="w-80"
              onChange={(e) => {
                setBrokerName(e.target.value);
              }}
              value={brokerName}
            >
              <option value='allbroker'>All brokers</option>
              {brokers.map((broker, i) => (
                <option key={i} value={broker.name}>
                  {broker.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Is Summary: </label>
            <input 
              name="is_summary"
              type="checkbox"
              checked={isSummary}
              onChange={(e) => setIsSummary(e.target.checked)}
              />
          </div>

          <button onClick={fetchInvoices}>Submit</button>
          {filteredInvoices.length > 0 && (
            <button onClick={handlePrint}>Print</button>
          )}
        </section>

        {filteredInvoices.length > 0 ? (
          <section style={{ background: "white", color: "black", display: 'flex', justifyContent: 'center' }}>
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
                    <h2>
                      GOLDEN POULTRY
                      <br />
                      FARMS
                    </h2>
                  </th>
                </tr>

                <tr>
                  <th colSpan={2}>Date</th>
                  {isSummary ? <th colSpan={2}>Credit</th> : <>
                    <th>Vehicle</th>
                    <th>Credit</th>
                  </>}

                </tr>

                {isSummary ? (
                  Object.entries(calculateCredit(filteredInvoices)).map(([d, c], i) => (
                    <tr key={i}>
                      <td colSpan={2}>
                        <span>{d}</span>
                      </td>
                      <td colSpan={2}>
                        <span>{numberWithCommas(c)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredInvoices.map((invoice, i) => {
                    return <>{getCredit(invoice) > 0 && <tr key={i}>
                      <td colSpan={2}>
                        <span>{invoice.date.substring(0, 10)}</span>
                      </td>
                      <td>
                        <span>{invoice.vehicle_no}</span>
                      </td>
                      <td colSpan={1}>
                        <span>{numberWithCommas(getCredit(invoice))}</span>
                      </td>
                    </tr>}</>
                  })
                )}

                {!isSummary && (
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                )}

                <tr>
                  <td colSpan={2}><b>Total</b></td>
                  <td colSpan={2}>
                    <span>{numberWithCommas(getTotalCredit(filteredInvoices))}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : (
          <p>No Invoices Found</p>
        )}

      </div>
    </>
  );
}
