import { createClient } from "@supabase/supabase-js";

export { getNote, insertNote, deleteNote, updateNote };

//supabase.com  сервисный следует использовать только на сервере, а не на клиенте или в браузере.
const SUPABASE_URL = "https://obbgzeamtcqhzsiwmktq.supabase.co";
const supabase = createClient(
  SUPABASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYmd6ZWFtdGNxaHpzaXdta3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUyOTE4OTEsImV4cCI6MTk3MDg2Nzg5MX0.Y5_Qju8baHUSW6JFK62TgK4vlFF-tHBafrSYSU0gJ4w"
);

//добавление тегов в заметку
const addTags = (obj, text) => {
  const regex = /#\w+/gm;
  obj.tags = text.match(regex);
};

const textNotTags = (text, obj) => {
  return (obj.tags = [text]);
};

async function getNote(userId) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId);
    return data;
  } catch (error) {
    throw error;
  }
}

// добавление заметки supabase
async function insertNote(newText, userId) {
  const newNote = {
    bodyNote: newText,
    tags: [],
    timeCreate: Date.now(),
    user_id: userId,
  };
  newText.search(/#\w+/gm) !== -1
    ? addTags(newNote, newText)
    : textNotTags("no tags", newNote);

  try {
    const { data, error } = await supabase.from("notes").insert(newNote);
  } catch (err) {
    throw err;
  }
}

//удаление заметки supabase
async function deleteNote(id, setNotes, notes) {
  try {
    setNotes(notes.filter((i) => i.id !== id));
    const { data, error } = await supabase.from("notes").delete().eq("id", id);
  } catch (error) {
    throw error;
  }
}

//редактирование заметки supabase
async function updateNote(newText, id, setStateTag) {
  const newTag = (newText) => {
    const tags = newText.match(/#\w+/gm);
    setStateTag(tags);
    return tags;
  };

  const textNewNotTags = (text) => {
    const tags = [text];
    return tags;
  };

  try {
    const { data, error } = await supabase
      .from("notes")
      .update({
        bodyNote: newText,
        tags:
          newText.search(/#\w+/gm) !== -1
            ? newTag(newText)
            : textNewNotTags("no tags"),
      })
      .eq("id", id);
  } catch (error) {
    throw error;
  }
}