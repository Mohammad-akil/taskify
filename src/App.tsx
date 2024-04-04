import {
  Box,
  Input,
  Typography,
  Button,
  Divider,
  Fab,
  Modal,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { TravelExplore, Edit, Delete, Add } from "@mui/icons-material";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
const url = "http://localhost:3000/api/tasks/";

interface Task {
  completed: string;
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
  _v: number;
  _id: string;
}

const App = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState<true | false>(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<true | false>(
    false
  );

  const [query, setQuery] = React.useState<string>("");

  const [updateItemId, setUpdateItemId] = React.useState<string>("");
  const [updateItemTitle, setUpdateItemTitle] = React.useState<string>("");
  const [status, setStatus] = React.useState("completed");
  const [updateTask, setUpdateTask] = React.useState<Task>({} as Task);

  const [taskList, setTaskList] = React.useState<[] | Task[]>([]);
  const filteredList = taskList.filter((item) => {
    return item.title.toLowerCase().includes(query.toLowerCase().trim());
  });

  // add modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // update modaal
  const handleOpenUpdateModal = () => setOpenUpdateModal(true);
  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  const handleAddTask = async () => {
    const task = inputRef.current?.value;

    if (task) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task,
        }),
      });
      const data = await response.json();
      console.log(data);
      toast.success("Task added successfully", {
        position: "top-center",
        duration: 1500,
      });
      fetchTasks();
      inputRef.current.value = "";
      handleClose();
    }
  };

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(url + id, {
        method: "DELETE",
      });
      fetchTasks();
      const data = await response.json();
      console.log(data);
      toast.success("Task deleted successfully", {
        position: "top-center",
        duration: 1500,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:3000/api/tasks");
    const data = await response.json();
    console.log(data);
    setTaskList(data);
  };

  const handleUpdateTask = async (id: string, title: string) => {
    try {
      const response = await fetch(url + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          completed: status,
        }),
      });
      const data = await response.json();
      console.log(data);
      toast.success("Task updated successfully", {
        position: "top-center",
        duration: 1500,
      });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateTask((prev) => {
      return {
        ...prev,
        completed: event.target.value,
      };
    });
    setStatus(event.target.value);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box
      width={800}
      sx={{
        p: 2,
        border: "2px dashed #6c63ff",
        borderRadius: "10px",
        margin: "0 auto",
        marginTop: "20px",
        marginBottom: "20px",
        paddingBottom: "120px",
        position: "relative",
      }}
    >
      <Typography align="center" variant="h4">
        DAILY TASK LIST
      </Typography>

      <div className="border-2 rounded-xl py-1 border-purple-500 flex justify-center items-center mt-3">
        <Input
          autoFocus
          fullWidth
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          disableUnderline={true}
          placeholder="Search task..."
          className="pl-3 text-right"
        />
        <TravelExplore className="mx-3" style={{ color: "#6c63ff" }} />
      </div>

      <div className="mt-4">
        {filteredList.length === 0 && query.length > 0 && (
          <div className="flex flex-col justify-center items-center">
            <img
              src="../src/assets/images/emptyTask.png"
              className="h-40 w-40"
            />
            <p className="text-[#6c63ff] text-2xl mt-2 underline">
              No Tasks found
            </p>
          </div>
        )}

        {filteredList?.map((item, index) => {
          return (
            <div key={index} className="px-5  mb-2">
              <div className="px-4 w-100  p-2 flex justify-between items-center">
                <div className="flex grow flex-row  items-center ">
                  <p
                    className={`text-xl text-wrap overflow-hidden ${
                      item.completed === "completed" &&
                      "line-through text-green-500"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center ">
                  <Button
                    sx={{ border: "0px solid" }}
                    onClick={() => {
                      handleOpenUpdateModal();
                      setUpdateItemId(item.id);
                      setUpdateItemTitle(item.title);
                      setUpdateTask(item);
                    }}
                  >
                    <Edit className="text-purple-400" fontSize="medium" />
                  </Button>
                  <Button onClick={() => handleDeleteTask(item.id)}>
                    <Delete className="text-red-400" fontSize="medium" />
                  </Button>
                </div>
              </div>
              <Divider />
            </div>
          );
        })}
      </div>

      <div
        className="absolute bottom-6 right-6 h-16 w-16 flex justify-center items-center rounded-full"
        onClick={() => {
          handleOpen();
          inputRef.current?.focus();
        }}
      >
        <Fab color="primary">
          <Add sx={{ color: "white" }} />
        </Fab>
      </div>

      {/* New task add Modal  */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography textAlign={"center"} variant="h5">
            New Task
          </Typography>
          <div className="border-2 border-purple-500 rounded-lg mt-5">
            <Input
              inputRef={inputRef}
              autoFocus
              fullWidth
              disableUnderline={true}
              placeholder="Input your note..."
              className="pl-3 text-right"
            />
          </div>
          <div className="flex justify-between items-center mt-10">
            <Button variant="outlined" onClick={handleClose}>
              cancel
            </Button>
            <Button variant="contained" onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Update modal  */}
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography textAlign={"center"} variant="h5">
            Update Task
          </Typography>
          <div className="border-2 border-purple-500 rounded-lg mt-5">
            <Input
              autoFocus
              fullWidth
              value={updateItemTitle}
              onChange={(e) => setUpdateItemTitle(e.target.value)}
              disableUnderline={true}
              placeholder="Input your note..."
              className="pl-3 text-right"
            />
          </div>
          <div className="my-3 flex justify-center">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={updateTask.completed}
                row
                onChange={handleChange}
              >
                <FormControlLabel
                  value="pending"
                  control={
                    <Radio
                      sx={{
                        color: "#a855f7",
                        "&.Mui-checked": {
                          color: "red",
                        },
                      }}
                    />
                  }
                  label="pending"
                />
                <FormControlLabel
                  value="completed"
                  control={
                    <Radio
                      sx={{
                        color: "#a855f7",
                        "&.Mui-checked": {
                          color: "green",
                        },
                      }}
                    />
                  }
                  label="completed"
                />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="flex justify-between items-center mt-10">
            <Button variant="outlined" onClick={handleCloseUpdateModal}>
              cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleUpdateTask(updateItemId, updateItemTitle);
                handleCloseUpdateModal();
              }}
            >
              update Task
            </Button>
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default App;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 5,
  px: 3,
  py: 3,
};
