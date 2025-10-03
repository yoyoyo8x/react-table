import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTableData = createAsyncThunk(
  "table/getData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
