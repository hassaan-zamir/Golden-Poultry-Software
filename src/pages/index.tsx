import Head from "next/head";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Sheds from "@/components/Sheds";
import Houses from "@/components/Houses";
import DataTable from "react-data-table-component";
import Brokers from "@/components/Brokers";
import DeliveryChallan from "@/components/DeliveryChallan";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdvanceSlip from "@/components/AdvanceChallan";

export async function getServerSideProps() {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getMasterData"
  );
  const brokers = res.data.brokers;
  const sheds = res.data.sheds;
  const invoices = res.data.invoices;

  return { props: { sheds, invoices, brokers } };
}

export interface BrokerType {
  id: string;
  name: string;
}

export interface ShedsMasterDataType {
  id: string;
  name: string;
  houses: string[];
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
  sheds: ShedsMasterDataType[];
  invoices: InvoiceType[];
  brokers: BrokerType[];
}

export default function Home({ sheds, invoices, brokers }: PropTypes) {

  const router = useRouter();

  const [printDeliveryChallan, setPrintDeliveryChallan] = useState<boolean>(false);
  const [printAdvanceChallan, setPrintAdvanceChallan] = useState<boolean>(false);

  const [mutatedInvoices, setMutatedInvoices] =
    useState<InvoiceType[]>(invoices);

  const [searchText, setSearchText] = useState<string>("");
  const [filteredInvoices, setFilteredInvoices] = useState(mutatedInvoices);

  const [n, forceUpdate] = useState<number>();

  const [mutatedSheds, setMutatedSheds] =
    useState<ShedsMasterDataType[]>(sheds);

  const [mutatedBrokers, setMutatedBrokers] = useState<BrokerType[]>(brokers);

  const [loading, setLoading] = useState<boolean>(true);
  const [rowid, setRowId] = useState<number | null>(null);
  const [challanNo, setChallanNo] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [shedNo, setShedNo] = useState<string>("");
  const [houseNo, setHouseNo] = useState<string>("");
  const [todaysRate, setTodaysRate] = useState<string>();
  const [brokerName, setBrokerName] = useState<string>("");
  const [addLess, setAddLess] = useState<string>("0");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [cash, setCash] = useState<number>();
  const [online, setOnline] = useState<number>();
  const [firstWeight, setFirstWeight] = useState<number>();
  const [secondWeight, setSecondWeight] = useState<number>();
  const [paid, setPaid] = useState<boolean>(false);
  const [commission, setCommission] = useState<number>();

  const findInvoice = (i:number, searchInvoices:InvoiceType[]):InvoiceType | null => {
    let invoice:InvoiceType | null = null;
    searchInvoices.map((inv) => {
      if(inv.id == i){
        invoice=inv;
      }
    });
    return invoice;
  }

  const handleChallanClick = (row: InvoiceType) => {
    const date = new Date(row.date);
    setChallanNo(
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}-${row.id}`
    );
    setRowId(row.id);
    setDate(date.toISOString().substr(0, 10));
    setShedNo(row.shed);
    setHouseNo(row.house_no);
    setTodaysRate(row.todays_rate.toString());
    setBrokerName(row.broker_name);
    setAddLess(row.add_less.toString());
    setVehicleNo(row.vehicle_no);
    setDriverName(row.driver_name);
    setCash(row.cash);
    setOnline(row.online);
    setFirstWeight(row.first_weight);
    setSecondWeight(row.second_weight);
    setPaid(row.paid ? true : false);
    setCommission(row.commission);
    setSearchText("")
    window.scroll(0,0);
  };

  const columns = [
    {
      name: "Challan Number",
      selector: (row: InvoiceType) => row.date + "/" + row.id,
      cell: (row: InvoiceType) => {
        return (
          <div
            onClick={() => handleChallanClick(row)}
            className="challanNoCell"
          >
            {row.date}/{row.id}
          </div>
        );
      },
    },
    {
      name: "Shed",
      selector: (row: InvoiceType) => row.shed,
    },
    {
      name: "Vehicle No",
      selector: (row: InvoiceType) => row.vehicle_no,
    },
    {
      name: "Broker",
      selector: (row: InvoiceType) => row.broker_name,
    },
    {
      name: "Driver",
      selector: (row: InvoiceType) => row.driver_name,
    },
    {
      name: "Commission",
      selector: (row: InvoiceType) => row.commission,
    },
    {
      name: "Final Rate",
      selector: (row: InvoiceType) =>
        Number(row.todays_rate) + Number(row.add_less),
    },
    {
      name: "1st Wgt",
      selector: (row: InvoiceType) => row.first_weight,
    },
    {
      name: "2nd Wgt",
      selector: (row: InvoiceType) => row.second_weight,
    },
    {
      name: "Net Wgt",
      selector: (row: InvoiceType) =>
        Number(row.second_weight) - Number(row.first_weight),
    },
    {
      name: "Advance",
      selector: (row: InvoiceType) => Number(row.cash) + Number(row.online),
    },
    {
      name: "Status",
      selector: (row: InvoiceType) => (row.paid ? "Paid" : "Pending"),
    },
  ];

  const clearInputs = async () => {
    setCash(undefined);
    setOnline(undefined);
    setVehicleNo("");
    setDriverName("");
    setFirstWeight(undefined);
    setSecondWeight(undefined);
    setCommission(undefined);
    setRowId(null);
    setPaid(false)
    await fetchAndSetChallanNo();
  };

  const fetchAndSetChallanNo = async () => {
    const resp = await axios.post("/api/getChallanNo");
    if (resp.data.challanNo) {
      const currentDate = new Date();
      const formattedDate = `${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      const fullChallanNo = formattedDate + "-" + resp.data.challanNo;

      setChallanNo(fullChallanNo);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = mutatedInvoices.filter(
      (invoice) =>
        invoice.driver_name.toLowerCase().includes(text.toLowerCase()) ||
        invoice.broker_name.toLowerCase().includes(text.toLowerCase()) ||
        invoice.vehicle_no.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    setFilteredInvoices(mutatedInvoices);
  }, [mutatedInvoices]);

  useEffect(() => {
    fetchAndSetChallanNo();
  }, []);

  useEffect(() => {
    const getDefaultBroker = (): string => {
      if (mutatedBrokers.length > 0) {
        return mutatedBrokers[0].name;
      }
      return "";
    };

    const getDefaultShed = (): string => {
      if (mutatedSheds.length > 0) {
        return mutatedSheds[0].name;
      }
      return "";
    };

    const getDefaultHouse = (): string => {
      if (mutatedSheds.length > 0) {
        if (mutatedSheds[0].houses.length > 0) {
          return mutatedSheds[0].houses[0];
        }
      }
      return "";
    };

    const checkAvailable = (
      value: string | null,
      type: string
    ): string | null => {
      if (value) {
        if (type == "shed-no") {
          const findShed = mutatedSheds.find((shed) => shed.name == value);
          if (findShed) {
            return value;
          }
        } else if (type == "house-no") {
          const findShed = mutatedSheds.find((shed) => shed.name == shedNo);
          if (findShed) {
            const findHouse = findShed.houses.find((house) => house == value);
            if (findHouse) {
              return value;
            }
          }
        } else if (type == "broker-name") {
          const findBroker = mutatedBrokers.find(
            (broker) => broker.name == value
          );
          if (findBroker) {
            return value;
          }
        }
      }

      return null;
    };
    (async () => {
      try {
        if (typeof localStorage !== "undefined") {
          const defaultShedNo =
            checkAvailable(localStorage.getItem("shed-no"), "shed-no") ??
            getDefaultShed();
          const defaultHouseNo =
            checkAvailable(localStorage.getItem("house-no"), "house-no") ??
            getDefaultHouse();

          const defaultBrokerName =
            checkAvailable(
              localStorage.getItem("broker-name"),
              "broker-name"
            ) ?? getDefaultBroker();
          setShedNo(defaultShedNo);
          setHouseNo(defaultHouseNo);
          setBrokerName(defaultBrokerName);

          const defaultDate =
            localStorage.getItem("date") ??
            new Date().toISOString().substr(0, 10);
          const defaultTodaysRate = Number(
            localStorage.getItem("t-rate") ?? "0"
          );
          const defaultAddless = 
            localStorage.getItem("add-less") ?? "0"
          
          if(isNaN(parseFloat(defaultAddless))){
            setAddLess("0");
          }else{
            setAddLess(defaultAddless);
          }
          
          
          setTodaysRate(defaultTodaysRate.toString());

          setDate(defaultDate);
        }
      } catch (e) {
        console.log("Error while generating challan no", e);
      }
      setLoading(false);
    })();
  }, []);
  // mutatedBrokers, mutatedSheds, shedNo

  if (!challanNo) {
    return <p>Error generating challan no. Please try refreshing..</p>;
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "date":
        localStorage.setItem("date", value);
        setDate(value);
        break;
      case "t_rate":
        localStorage.setItem("t-rate", value);
        
        setTodaysRate(value);
        break;
      case "cash":
        setCash(value.trim()=="" ? undefined: parseFloat(value));
        break;
      case "first_weight":
        setFirstWeight(value.trim()=="" ? undefined: parseFloat(value));
        break;
      case "second_weight":
        setSecondWeight(value.trim()=="" ? undefined: parseFloat(value));
        break;
      case "add_less":
        localStorage.setItem("add-less", value);

        setAddLess(value);
        break;
      case "vehicle_no":
        setVehicleNo(value);
        break;
      case "online":
        setOnline(value.trim()=="" ? undefined: parseFloat(value));
        break;
      case "driver_name":
        setDriverName(value);
        break;
      case "commission":
        setCommission(value.trim()=="" ? undefined: parseFloat(value));
        break;
      default:
        break;
    }
  };

  const getFinalRate = (): number => {
    return Number(todaysRate ?? 0) + Number(addLess ?? 0);
  };

  const getTotalAdvance = (): number => {
    return Number(cash ?? 0) + Number(online ?? 0);
  };

  const getNetWeight = (): number => {
    if((secondWeight ?? 0) <= (firstWeight ?? 0)){
      return 0;
    }
    return Number(secondWeight ?? 0) - Number(firstWeight ?? 0);
  };

  const getTotalAmount = (): number => {
    return getFinalRate() * getNetWeight();
  };

  const getBalance = (): number => {
    return getTotalAmount() - getTotalAdvance();
  };

  const addInvoice = async () => {
    if (rowid) {
      alert("Duplicated challan No. Please use update or reset the form");
      return;
    }

    if (driverName.trim() == "") {
      alert("Driver name is required");
    } else if (vehicleNo.trim() == "") {
      alert("Vehicle no is required");
    } else if (confirm("Are you sure?")) {
      if (firstWeight && secondWeight) {
        if (secondWeight <= firstWeight) {
          alert("Second weight should be greater than first weight");
          return;
        }
      }
      try {
        const resp = await axios.post("/api/addInvoice", {
          vehicle_no: vehicleNo,
          date,
          shed: shedNo,
          house_no: houseNo,
          broker_name: brokerName,
          driver_name: driverName,
          first_weight: firstWeight,
          second_weight: secondWeight,
          todays_rate: Number(todaysRate ?? 0) ?? 0,
          add_less: Number(addLess ?? 0) ?? 0,
          cash: cash ?? 0,
          online: online ?? 0,
          commission: commission ?? 0,
          paid: paid ? 1 : 0,
        });

        if (resp.data.invoices) {
          toast.success('Invoice created successfully');
          setMutatedInvoices(resp.data.invoices);
          
        }
      } catch (e) {
        alert("Could not create invoice. Please try again");
        console.log("Error while adding new invoice", e);
      }
    }
  };

  const saveInvoice = () => {
    if(!rowid){
    
      addInvoice();
    }else{
      updateInvoice();
    }
  }

  const deleteInvoice = async () => {
    if (!rowid) {
      alert(
        "Please select a record by clicking on challan no in the table below"
      );
      return;
    }

    if (confirm("Are you sure?")) {
      try {
        const resp = await axios.post("/api/deleteInvoice", {
          id: rowid,
        });
        toast.success('Invoice deleted successfully');
        setMutatedInvoices(resp.data.invoices)
      } catch (e) {
        alert("Could not delete invoice. Please try again");
        console.log("Error while deleteing an invoice", e);
      }
    }
  };

  const updateInvoice = async () => {
    if (!rowid) {
      alert(
        "Please select a record by clicking on challan number in table below"
      );
      return;
    }

    if (driverName.trim() == "") {
      alert("Driver name is required");
    } else if (vehicleNo.trim() == "") {
      alert("Vehicle no is required");
    } else if (true) {
      if (firstWeight && secondWeight) {
        if (secondWeight <= firstWeight) {
          alert("Second weight should be greater than first weight");
          return;
        }
      }
      try {
        const resp = await axios.put("/api/updateInvoice", {
          id: rowid,
          vehicle_no: vehicleNo,
          date,
          shed: shedNo,
          house_no: houseNo,
          broker_name: brokerName,
          driver_name: driverName,
          first_weight: firstWeight,
          second_weight: secondWeight,
          todays_rate: Number(todaysRate ?? 0) ?? 0,
          add_less: Number(addLess ?? 0) ?? 0,
          cash: cash ?? 0,
          online: online ?? 0,
          commission: commission ?? 0,
          paid: paid ? 1 : 0,
        });

        if (resp.data.invoices) {
          toast.success("Invoice Updated successfully");
          setMutatedInvoices(resp.data.invoices);
         
        }
      } catch (e) {
        alert("Could not update invoice. Please try again");
        console.log("Error while updating an invoice", e);
      }
    }
  };


  return (
    <>
      <Head>
        <title>Poultry Invoice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>


        <table id="invoice-form">
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Challan No</label>
                  <input type="text"  value={challanNo ?? ""} />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    name="date"
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td>
                <Sheds
                  sheds={mutatedSheds}
                  shedNo={shedNo}
                  setShedNo={setShedNo}
                  setSheds={setMutatedSheds}
                />
              </td>
              <td>
                <Houses
                  sheds={mutatedSheds}
                  houseNo={houseNo}
                  setHouseNo={setHouseNo}
                  shed_selected={shedNo}
                  setSheds={setMutatedSheds}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Today&apos;s rate</label>
                  <input
                    type="text"
                    name="t_rate"
                    value={todaysRate ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Rate Add/Less</label>
                  <input
                    type="text"
                    name="add_less"
                    value={addLess ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Final Rate</label>
                  <input
                    type="text"
                    name="final_rate"
                    value={getFinalRate()}
                    
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Brokers
                  brokers={mutatedBrokers}
                  broker={brokerName}
                  setBroker={setBrokerName}
                  setBrokers={setMutatedBrokers}
                />
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Vehicle No</label>
                  <input
                    type="text"
                    name="vehicle_no"
                    value={vehicleNo}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    name="driver_name"
                    value={driverName}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Cash</label>
                  <input
                    type="text"
                    name="cash"
                    value={cash ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Online</label>
                  <input
                    type="text"
                    name="online"
                    value={online ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Total Advance</label>
                  <input
                    type="text"
                    name="total_advance"
                    
                    value={getTotalAdvance()}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="form-group">
                  <label>First Weight</label>
                  <input
                    type="text"
                    name="first_weight"
                    value={firstWeight ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label
                    className={
                      (secondWeight ?? 0) <= (firstWeight ?? 0) ? "warning" : ""
                    }
                  >
                    Second Weight
                  </label>
                  <input
                    type="text"
                    name="second_weight"
                    value={secondWeight ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Net Weight</label>
                  <input
                    type="text"
                    name="net_weight"
                    
                    value={getNetWeight()}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Total Amount</label>
                  <input
                    type="text"
                    name="total_amount"
                    
                    value={getTotalAmount()}
                  />
                </div>
              </td>
              <td colSpan={2}>
                <div className="form-group">
                  <label>Balance</label>
                  <input
                    type="text"
                    name="balance"
                    
                    value={getBalance()}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <label>Paid</label>
                  <input
                    type="checkbox"
                    name="paid"
                    checked={paid}
                    onChange={() => setPaid(!paid)}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <label>Commission</label>
                  <input
                    type="text"
                    name="commission"
                    value={commission ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <section id="action-buttons">
          <button
            type="button"
            id="add_invoice"
            className="success-btn"
            onClick={saveInvoice}
          >
            Save
          </button>

          <button
            type="button"
            id="delete_invoice"
            className="danger-btn"
            onClick={deleteInvoice}
          >
            Delete
          </button>
          <button
            type="button"
            id="reset_invoice"
            className="grey-btn"
            onClick={() => clearInputs()}
          >
            Reset
          </button>

          <input
              type="text"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by Driver or Broker or Vehicle"
            />
        </section>

        {rowid && <section id="action-buttons">
          <button
            onClick={async () => {
              await updateInvoice();
              setPrintDeliveryChallan(true);
            }}
            className="btn success-btn"
            // href={`/advance-slip/${rowid}`}
          >
            Advance Slip Print
          </button>
          <button
            className="btn info-btn"
            // href={`/delivery-challan/${rowid}`}
            onClick={async () => {
              await updateInvoice();
              setPrintDeliveryChallan(true);
            }}
          >
            Delivery Challan Print
          </button>
        </section>}

        <section id="table">
         
          <DataTable
            key={n}
            columns={columns}
            data={filteredInvoices}
            theme="dark"
            pagination
            progressPending={loading}
          />
        </section>

      </main>
      <ToastContainer />
      {rowid && <DeliveryChallan invoice={findInvoice(rowid, mutatedInvoices)} printInvoice={printDeliveryChallan} setPrintInvoice={setPrintDeliveryChallan}/>}
      {rowid && <AdvanceSlip invoice={findInvoice(rowid, mutatedInvoices)} printInvoice={printAdvanceChallan} setPrintInvoice={setPrintAdvanceChallan}/>}
    </>
  );
}