import { BrokerType } from "@/pages/home";
import axios from "axios";

interface PropTypes {
  brokers: BrokerType[];
  setBrokers: React.Dispatch<React.SetStateAction<BrokerType[]>>;
  broker: string;
  setBroker: React.Dispatch<React.SetStateAction<string>>;
}

const Brokers = ({ brokers, broker, setBroker, setBrokers }: PropTypes) => {

  const capitalizeWords = (str:string):string => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }


  const addBroker = async () => {
    const broker_name = capitalizeWords(prompt("Enter Broker Name : ")?? "").trim();

    if(broker_name == ""){
        alert('Invalid broker name');
        return;
    }

    try {
      const resp = await axios.post("/api/addBroker", {
        name: broker_name,
      });
      
      if (resp) {
        setBrokers(resp.data.brokers);
        alert("Broker added successfully");
      } else {
        alert("Could not add. Please try again");
      }
    } catch (e) {
      console.log("Error while adding new broker", e);
      alert("Could not add. Please try again");
    }
  };

  return (
    <div className="form-group">
      <label>Broker Name</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        {brokers.length > 0 && broker != "" && (
          <select
            name="broker_name"
            className="w-80"
            onChange={(e) => {
              localStorage.setItem("broker-name", e.target.value);
              setBroker(e.target.value);
            }}
            value={broker}
          >
            {brokers.map((b, i) => (
              <option key={i} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        <button className="add-btn" type="button" onClick={addBroker}>
          +
        </button>
      </div>
    </div>
  );
};

export default Brokers;
