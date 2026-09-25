import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineChevronLeft,
} from "react-icons/hi";

import ExamBasicInfo from "../../components/landing/LandingHero";
import ExamSettings from "../../components/landing/LandingServices";
import ExamPublishingSettings from "../../components/landing/LandingFleet";
import ExamFooterActions from "../../components/landing/LandingGallery";



// Available groups mock data
const ALL_AVAILABLE_GROUPS = [
  "Group A - 1st Secondary",
  "Group B",
  "Group C - 2nd Secondary",
  "Group D - 1st Secondary",
  "Group E - 3rd Secondary",
];

export default function Exams() {
  const navigate = useNavigate();

  const [examTitle, setExamTitle] = useState("");

  const [selectedGroups, setSelectedGroups] = useState([
    "Group A - 1st Secondary",
    "Group B",
  ]);

  const [groupInput, setGroupInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [timeLimit, setTimeLimit] = useState(60);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(true);

  const [questionsPerPage, setQuestionsPerPage] = useState("");

  const [publishingSchedule, setPublishingSchedule] =
    useState("instant");

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [showInstantResults, setShowInstantResults] =
    useState(true);

  const suggestionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const filteredSuggestions =
    ALL_AVAILABLE_GROUPS.filter(
      (group) =>
        !selectedGroups.includes(group) &&
        group
          .toLowerCase()
          .includes(groupInput.toLowerCase())
    );

  const addGroup = (group) => {
    if (!selectedGroups.includes(group)) {
      setSelectedGroups([...selectedGroups, group]);
    }

    setGroupInput("");
    setShowSuggestions(false);
  };

  const removeGroup = (groupToRemove) => {
    setSelectedGroups(
      selectedGroups.filter(
        (g) => g !== groupToRemove
      )
    );
  };

  const selectAllGroups = () => {
    setSelectedGroups([
      ...ALL_AVAILABLE_GROUPS,
    ]);
  };

  const handlePublish = (e) => {
    e.preventDefault();

    const examData = {
      examTitle,
      selectedGroups,
      timeLimit,
      autoSubmit,
      shuffleQuestions,
      shuffleAnswers,
      questionsPerPage,
      publishingSchedule,
      scheduleDate:
        publishingSchedule === "later"
          ? scheduleDate
          : null,
      scheduleTime:
        publishingSchedule === "later"
          ? scheduleTime
          : null,
      showInstantResults,
    };

    console.log(examData);

    navigate("/dashboard");
  };

  return (
    <div className="w-full mx-auto space-y-6">

      <ExamBasicInfo
        examTitle={examTitle}
        setExamTitle={setExamTitle}
        selectedGroups={selectedGroups}
        groupInput={groupInput}
        setGroupInput={setGroupInput}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        filteredSuggestions={filteredSuggestions}
        addGroup={addGroup}
        removeGroup={removeGroup}
        selectAllGroups={selectAllGroups}
        suggestionsRef={suggestionsRef}
      />

      {/* Box 2 */}
      <ExamSettings
      timeLimit={timeLimit}
      setTimeLimit={setTimeLimit}
      autoSubmit={autoSubmit}
      setAutoSubmit={setAutoSubmit}
      shuffleQuestions={shuffleQuestions}
      setShuffleQuestions={setShuffleQuestions}
      shuffleAnswers={shuffleAnswers}
      setShuffleAnswers={setShuffleAnswers}
      questionsPerPage={questionsPerPage}
      setQuestionsPerPage={setQuestionsPerPage}
      />

      {/* Box 3 */}
      <ExamPublishingSettings
      publishingSchedule={publishingSchedule}
      setPublishingSchedule={setPublishingSchedule}
      scheduleDate={scheduleDate}
      setScheduleDate={setScheduleDate}
      scheduleTime={scheduleTime}
      setScheduleTime={setScheduleTime}
      showInstantResults={showInstantResults}
      setShowInstantResults={setShowInstantResults}
      />

      {/* Footer */}
     <ExamFooterActions
      navigate={navigate}
      handlePublish={handlePublish}
      />
    </div>
  );
}



