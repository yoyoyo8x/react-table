import { IData } from "@/types/table";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Table, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import "./App.css";
import InputHookForm from "./components/InputHookForm";
import TextAreaHookForm from "./components/TextAreaHookForm";
import { REDUX_STATUS } from "./constants";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { addRow, deleteRow, editRow } from "./redux/tableSlice";
import { getTableData } from "./service/table.service";

const defaultValues = {
  name: "",
  language: "",
  id: "",
  bio: "",
  version: "",
  createdDate: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  language: yup.string().required("Language is required"),
  bio: yup.string().required("Bio is required"),
  id: yup.string().required("ID is required"),
  version: yup.string().required("Version is required"),
  createdDate: yup.string().required("Created Date is required"),
});

function App() {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.table);
  const loaderRef = useRef(null);

  const [limitData, setLimitData] = useState(20);

  const [selectedRow, setSelectedRow] = useState<IData | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [addingRowId, setAddingRowId] = useState<boolean>(false);
  const [editingRowId, setEditingRowId] = useState<boolean>(false);
  const [deletingRowId, setDeletingRowId] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getTableData());
  }, []);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedRow) {
      reset(selectedRow);
    } else {
      reset(defaultValues);
    }
  }, [selectedRow]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry?.isIntersecting && limitData < data.length) {
        setLimitData((prev) => prev + 20);
      }
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loaderRef, data]);

  if (status == REDUX_STATUS.PENDING) {
    return (
      <div className="w-full h-dvh flex items-center justify-center gap-2 flex-col">
        <div className="animate-spin border-b-2 rounded-full size-8 border-b-blue-600"></div>
        <div>Loading...</div>
      </div>
    );
  }

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 80,
      fixed: "left" as const,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      width: 100,
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      width: 240,
      render: (text: string) => (
        <Tooltip title={text}>
          <div className="line-clamp-2 w-60">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 80,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 160,
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right" as const,
      render: (data: IData) => (
        <div className="flex items-center gap-4">
          <button
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => {
              setShowEditModal(true);
              setSelectedRow(data);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-400 cursor-pointer hover:underline"
            onClick={() => {
              setShowDeleteModal(true);
              setSelectedRow(data);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="text-2xl font-bold text-center">React Table</div>
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => {
              setShowAddModal(true);
              reset({
                ...defaultValues,
                id: new Date().getTime().toString(),
                createdDate: new Date().toISOString(),
                version: "10.0.0",
              });
            }}
          >
            + Add New Row
          </Button>
        </div>
        <Table
          rowKey={(data) => data.id}
          dataSource={data.slice(0, limitData)}
          columns={columns}
          pagination={false}
        />
        {limitData < data.length && (
          <div
            ref={loaderRef}
            className="flex items-center justify-center my-4"
          >
            <div className="animate-spin border-b-2 rounded-full size-8 border-b-blue-600"></div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
        }}
        footer={<></>}
      >
        <div className="text-center text-2xl font-bold text-blue-500 mb-4">
          Add Row
        </div>
        <Form layout="vertical" className="">
          <div className="w-full grid grid-cols-2 gap-2">
            <InputHookForm name="id" control={control} label="ID" disabled />
            <InputHookForm
              name="language"
              control={control}
              errors={errors}
              label="Language"
              placeholder="Enter language"
              required
            />
          </div>
          <InputHookForm
            name="name"
            control={control}
            errors={errors}
            label="Name"
            placeholder="Enter name"
            required
          />
          <TextAreaHookForm
            name="bio"
            control={control}
            errors={errors}
            label="Bio"
            placeholder="Enter bio"
            required
          />
          <div className="w-full grid grid-cols-2 gap-2">
            <Button typeof="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              typeof="submit"
              type="primary"
              disabled={addingRowId}
              onClick={() =>
                handleSubmit((data) => {
                  setAddingRowId(true);
                  setTimeout(() => {
                    dispatch(addRow(data));
                    setAddingRowId(false);
                    setShowAddModal(false);
                  }, 2000);
                })()
              }
            >
              {addingRowId ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin border-b-2 rounded-full size-4 border-b-blue-300"></div>
                  <div>Saving...</div>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedRow(null);
        }}
        footer={<></>}
      >
        <div className="text-center text-2xl font-bold text-blue-500 mb-4">
          Edit Row
        </div>
        <Form layout="vertical" className="">
          <div className="w-full grid grid-cols-2 gap-2">
            <InputHookForm name="id" control={control} label="ID" disabled />
            <InputHookForm
              name="language"
              control={control}
              label="Language"
              disabled
              placeholder="Enter language"
            />
          </div>
          <InputHookForm
            name="name"
            control={control}
            errors={errors}
            label="Name"
            placeholder="Enter name"
            required
          />
          <TextAreaHookForm
            name="bio"
            control={control}
            errors={errors}
            label="Bio"
            placeholder="Enter bio"
            required
          />
          <div className="w-full grid grid-cols-2 gap-2">
            <Button
              typeof="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedRow(null);
              }}
            >
              Cancel
            </Button>
            <Button
              typeof="submit"
              type="primary"
              disabled={editingRowId}
              onClick={() =>
                handleSubmit((data) => {
                  setEditingRowId(true);
                  setTimeout(() => {
                    dispatch(editRow(data));
                    setEditingRowId(false);
                    setShowEditModal(false);
                  }, 2000);
                })()
              }
            >
              {editingRowId ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin border-b-2 rounded-full size-4 border-b-blue-300"></div>
                  <div>Saving...</div>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedRow(null);
        }}
        footer={<></>}
      >
        <div className="text-center text-2xl font-bold text-red-500">
          Delele Row
        </div>
        <div className="text-center text-lg my-4">
          Are you sure to delete {selectedRow?.name}?
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          <Button
            variant="outlined"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedRow(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setDeletingRowId(true);
              setTimeout(() => {
                dispatch(deleteRow(selectedRow!.id));
                setDeletingRowId(false);
                setSelectedRow(null);
                setShowDeleteModal(false);
              }, 2000);
            }}
            disabled={deletingRowId}
          >
            {deletingRowId ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin border-b-2 rounded-full size-4 border-b-blue-300"></div>
                <div>Deleting...</div>
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default App;
