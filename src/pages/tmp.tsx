import axios from 'axios';
import { useEffect } from 'react';

const Tmp = () => {

    const allData = [
        {
            "id": 29,
            "vehicle_no": "5357",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "WAJID-1",
            "first_weight": 2956,
            "second_weight": null,
            "todays_rate": 330,
            "add_less": 0,
            "cash": 0,
            "online": 0,
            "commission": 0,
            "paid": 0
        },
        {
            "id": 28,
            "vehicle_no": "3966",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Khalid",
            "driver_name": "abc",
            "first_weight": 2274,
            "second_weight": null,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 0,
            "online": 0,
            "commission": 0,
            "paid": 0
        },
        {
            "id": 27,
            "vehicle_no": "3238",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Khalid",
            "driver_name": "FAISAL",
            "first_weight": null,
            "second_weight": null,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 650000,
            "online": 0,
            "commission": 1000,
            "paid": 0
        },
        {
            "id": 25,
            "vehicle_no": "5357",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "WAJID",
            "first_weight": 2190,
            "second_weight": 2956,
            "todays_rate": 323,
            "add_less": 0,
            "cash": 436000,
            "online": 0,
            "commission": 1000,
            "paid": 0
        },
        {
            "id": 24,
            "vehicle_no": "1593",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "HAMID",
            "first_weight": 1014,
            "second_weight": 2014,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 0,
            "online": 320000,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 23,
            "vehicle_no": "654",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "RIZWAN",
            "first_weight": 1236,
            "second_weight": 2344,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 0,
            "online": 365000,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 22,
            "vehicle_no": "1084",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "ADAM KHAN",
            "first_weight": 1194,
            "second_weight": 2436,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 390000,
            "online": 8000,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 21,
            "vehicle_no": "1234",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "EHTISHAM",
            "first_weight": 1104,
            "second_weight": 2188,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 180000,
            "online": 183300,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 20,
            "vehicle_no": "021",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "ABDUL SATTAR",
            "first_weight": 1200,
            "second_weight": 2370,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 0,
            "online": 213000,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 19,
            "vehicle_no": "303",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "IMRAN",
            "first_weight": 1184,
            "second_weight": 1766,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 100000,
            "online": 0,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 18,
            "vehicle_no": "639",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "YOUNUS",
            "first_weight": 968,
            "second_weight": 1530,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 150000,
            "online": 0,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 17,
            "vehicle_no": "7227",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "NIAZ GUL",
            "first_weight": 1184,
            "second_weight": 2138,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 120000,
            "online": 192450,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 16,
            "vehicle_no": "5413",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "Mohsin",
            "first_weight": 1766,
            "second_weight": 2364,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 150000,
            "online": 33500,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 15,
            "vehicle_no": "6613",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "Sher Khan",
            "first_weight": 996,
            "second_weight": 1718,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 230000,
            "online": 0,
            "commission": 500,
            "paid": 0
        },
        {
            "id": 14,
            "vehicle_no": "4792",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "Waqar Khan",
            "first_weight": 2252,
            "second_weight": 3974,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 500000,
            "online": 0,
            "commission": 1000,
            "paid": 0
        },
        {
            "id": 13,
            "vehicle_no": "077",
            "date": "2023-12-30",
            "shed": "GHAZI-3",
            "house_no": "2",
            "broker_name": "Fateh Khan",
            "driver_name": "Wajid Ali",
            "first_weight": 1120,
            "second_weight": 2300,
            "todays_rate": 330,
            "add_less": -2.5,
            "cash": 350000,
            "online": 0,
            "commission": 500,
            "paid": 0
        }
    ]

    const run = async () => {
        try {

            const resp =  await axios.post('/api/addInvoice', allData[15]);
            // allData.map((data, i) => {
                
            // })
            
        }catch(e) {
            console.log('error', e);
        }

    }
    useEffect(() => {   

       run();
      
    },[])

    return <p>Test</p>

}

export default Tmp;