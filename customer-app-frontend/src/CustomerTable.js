import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("ASC");
  // const recordsPerPage = 20;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/customers`,
          {
            params: { search, sort, order, page },
          }
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCustomers();
  }, [search, page, sort, order]);

  return (
    <div>
      <div class="search-container">
        <input
          className="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or location"
        />
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.sno}>
                <td>{customer.sno}</td>
                <td>{customer.customer_name}</td>
                <td>{customer.age}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td>{customer.date}</td>
                <td>{customer.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <button onClick={() => setPage(Math.max(1, page - 1))}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
      {/* Sorting Controls */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="created_at">Date</option>
        <option value="time">Time</option>
      </select>
      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>
    </div>
  );
}

export default CustomerTable;
