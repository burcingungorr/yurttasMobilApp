import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Priority from './Priority';
import AddTask from './AddTask';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import PriorityInfo from './PriorityInfo';

const Tasks = ({ selectedDate }) => {
  const savedUsername = useSelector((state) => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);
  const [taskList, setTaskList] = useState([]);

  const fetchTasksForDate = (date) => {
    if (!roomCode) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('tasks')
      .where('date', '==', date)
      .onSnapshot(snapshot => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          note: doc.data().checked && doc.data().checkedBy
            ? `(${doc.data().checkedBy} tarafından yapıldı.)` : '',
        }));

        setTaskList(tasks);
      }, error => {
        console.error('Görevleri dinlerken hata:', error);
      });

    return unsubscribe; 
  };



  useEffect(() => {
    const unsubscribe = fetchTasksForDate(selectedDate);

    return () => {
      if (unsubscribe) unsubscribe(); 
    };
  }, [selectedDate]);

  const toggleCheck = async (index) => {
    const updatedTask = taskList[index];
    const newChecked = !updatedTask.checked;

    const updatedTaskData = {
      ...updatedTask,
      checked: newChecked,
      note: newChecked ? `(${savedUsername} tarafından yapıldı.)` : '',
      checkedBy: newChecked ? savedUsername : '',
    };



      await firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('tasks')
        .doc(updatedTask.id)
        .update({
          checked: newChecked,
          checkedBy: newChecked ? savedUsername : '',
        });

      setTaskList(prev =>
        prev.map((item, i) => (i === index ? updatedTaskData : item))
      );
  };

  return (
    <View style={styles.container}>
<ScrollView style={{ height: 400 }} contentContainerStyle={styles.scrollContent}>
{taskList.length === 0 ? (
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../assets/animations/task.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.noDataText}>Henüz hiç görev eklenmedi.</Text>
          </View>
        ) : (
          taskList.map((item, index) => (
            <View key={index} style={styles.task_container}>
              <Priority level={item.priority} checked={item.checked} onPress={() => toggleCheck(index)} />
              <View>
                <Text style={[styles.task, item.checked && styles.strikethrough]}>
                  {item.task}
                </Text>
                {item.note ? <Text style={styles.task_done}>{item.note}</Text> : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.fixedAddTask}>
        <AddTask selectedDate={selectedDate} />
      </View>

      <PriorityInfo />

    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: 'white',
    marginTop: 50,
    height:490
  },

  task_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 13,
  },
  task: {
    color: 'black',
    fontSize: 18,
    paddingTop: 5,
    marginLeft: 8,
  },
  task_done: {
    fontSize: 12,
    color: 'black',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  fixedAddTask: {
    position: 'absolute',
    bottom: 10, 
    left: 0,
    right: 0,
    padding: 10,
    borderTopColor: '#333',
    backgroundColor: 'white', 
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
});
