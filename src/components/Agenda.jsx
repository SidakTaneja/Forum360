import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Message from "./Message.jsx";
import Comments from "./comments";
import Questions from "./questions";
import Answered from "./Answered.jsx";
import { getToken } from "./token";
import { fetchAgenda } from "./data.jsx";

function Agenda() {
  const [currentScreen, setCurrentScreen] = useState("");
  const token = getToken();
  const [isLoading, setIsLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    fetchAgenda(token)
      .then((agendaData) => {
        setAgenda(agendaData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching agenda data:", error);
        setIsLoading(false);
      });
  }, [token]);

  function handleDragEnd(result) {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.index !== destination.index) {
      const updatedAgendaList = [...agenda];
      const [draggedItem] = updatedAgendaList.splice(source.index, 1);
      updatedAgendaList.splice(destination.index, 0, draggedItem);

      setAgenda(updatedAgendaList);

      localStorage.setItem("agendaList", JSON.stringify(updatedAgendaList));
    }
  }

  function handleDragStart(event, index) {
    event.dataTransfer.setData("text/plain", index.toString());
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event, dropIndex) {
    const dragIndex = parseInt(event.dataTransfer.getData("text/plain"));

    if (dragIndex !== dropIndex) {
      const updatedAgendaList = [...agenda];
      const draggedItem = updatedAgendaList[dragIndex];

      updatedAgendaList.splice(dragIndex, 1);
      updatedAgendaList.splice(dropIndex, 0, draggedItem);

      setAgenda(updatedAgendaList);

      localStorage.setItem("agendaList", JSON.stringify(updatedAgendaList));
    }
  }

  function handleMessagingClick() {
    setCurrentScreen("messaging");
  }

  function handleQuestionsClick() {
    setCurrentScreen("questions");
  }

  function handleCommentsClick() {
    setCurrentScreen("comments");
  }

  function handleAnsweredClick() {
    setCurrentScreen("answered");
  }

  function toggleExpand(index) {
    setExpandedItems((prevExpandedItems) => {
      const updatedExpandedItems = [...prevExpandedItems];
      updatedExpandedItems[index] = !updatedExpandedItems[index];
      return updatedExpandedItems;
    });
  }

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (currentScreen === "messaging") {
    return <Message />;
  }

  if (currentScreen === "questions") {
    return <Questions />;
  }

  if (currentScreen === "comments") {
    return <Comments />;
  }

  if (currentScreen === "answered") {
    return <Answered />;
  }
  return (
    <div className="main">
      <div className="tab-background">
        <img src={require("./assets/logo.png")} alt="logo" className="logo" />
        <h1 className="h1">
          Relate <span className="h2">Tools</span>
        </h1>
        <img
          src={require("./assets/menu (2).png")}
          alt="logo"
          className="menu"
        />
      </div>
      <div>
        <div className="buttons">
          <button
            type="button"
            name="messaging"
            onClick={handleMessagingClick}
            className="button"
          >
            <img
              src={require("./assets/messaging.png")}
              alt="logo"
              className="message"
            />
            <span className="button-text">Messaging</span>
          </button>
          <button
            type="button"
            name="feedback"
            className="button"
            style={{
              backgroundColor: "#232cff",
              color: "#ffffff",
              border: "1px solid white",
            }}
          >
            <img
              src={require("./assets/whitefeedback.png")}
              alt="logo"
              className="message"
            />
            <span className="button-text">Feedback</span>
          </button>
        </div>
        <div className="buttons1">
          <button type="button" name="analytics" className="button">
            <img
              src={require("./assets/chart.png")}
              alt="logo"
              className="message"
            />
            <span className="button-text">Analytics</span>
          </button>
          <button type="button" name="resources" className="button">
            <img
              src={require("./assets/file.png")}
              alt="logo"
              className="file"
            />
            <span className="button-text" style={{ marginLeft: "10px" }}>
              Resources
            </span>
          </button>
        </div>
      </div>
      <div className="feedback-container">
        <button
          name="questions"
          className="feedback-button"
          style={{ border: "none" }}
          onClick={handleQuestionsClick}
        >
          <span className="h4">Questions</span>
        </button>
        <button
          name="comments"
          className="feedback-button"
          style={{ border: "none" }}
          onClick={handleCommentsClick}
        >
          <span className="h4">Comments</span>
        </button>
      </div>
      <div className="feedback-container1">
        <button name="questions" className="feedback-button">
          <span className="h3">Agenda</span>
        </button>
        <button
          name="comments"
          className="feedback-button"
          style={{ border: "none" }}
          onClick={handleAnsweredClick}
        >
          <span className="h4">Answered</span>
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="agenda">
          {(provided) => (
            <div
              className="agenda-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {agenda.map((agendaItem, index) => (
                <Draggable key={index} draggableId={`agendaItem_${index}`} index={index}>
                  {(provided) => (
                    <div
                      className="agenda-questions"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img
                        src={require("./assets/drag.png")}
                        alt="drag"
                        className="dragicon"
                      />
                      <div className="agenda-text">
                        <text className="question-username">{agendaItem.FullChannel}</text>
                        <div className="question-text">
                          {expandedItems[index] ? (
                            <text>{agendaItem.Question}</text>
                          ) : (
                            <>
                              <text>{agendaItem.Question.substring(0, 30)}</text>
                              {agendaItem.Question.length > 30 && (
                                <button
                                  className="read-more-button"
                                  onClick={() => toggleExpand(index)}
                                >
                                  ... <span className="read-more-text">View More</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        {expandedItems[index] && (
                          <button
                            className="read-more-button"
                            onClick={() => toggleExpand(index)}
                          >
                            <span className="read-more-text">View Less</span>
                          </button>
                        )}
                      </div>
                      <div className="control control-checkbox">
                        <input type="checkbox" id={`myCheckbox${index}`} />
                        <label
                          htmlFor={`myCheckbox${index}`}
                          className="control_indicator"
                        ></label>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Agenda;