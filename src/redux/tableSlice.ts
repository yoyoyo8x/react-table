import { REDUX_STATUS } from "@/constants";
import { getTableData } from "@/service/table.service";
import type { IData } from "@/types/table";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TableState = {
  data: IData[];
  status: REDUX_STATUS;
};

const initialState: TableState = {
  data: [],
  status: REDUX_STATUS.IDLE,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<IData>) => {
      state.data = [
        {
          ...action.payload,
          no: 1,
        },
        ...state.data.map((item, index) => ({
          ...item,
          no: index + 2,
        })),
      ];
    },
    editRow: (state, action: PayloadAction<IData>) => {
      state.data = state.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data
        .filter((item) => item.id !== action.payload)
        .map((item, index) => ({
          ...item,
          no: index + 1,
        }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTableData.pending, (state) => {
      state.status = REDUX_STATUS.PENDING;
    });
    builder.addCase(
      getTableData.fulfilled,
      (state, action: PayloadAction<IData[]>) => {
        state.status = REDUX_STATUS.SUCCEEDED;
        state.data = action.payload.map((item: IData, index: number) => ({
          ...item,
          no: index + 1,
          createdDate: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        }));
      }
    );
    builder.addCase(getTableData.rejected, (state) => {
      state.status = REDUX_STATUS.FAILED;
    });
  },
});

export const { addRow, editRow, deleteRow } = tableSlice.actions;
export default tableSlice.reducer;
