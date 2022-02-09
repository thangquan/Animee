import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert,ToastAndroid} from 'react-native';
import ContentPost from './ContentPost';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ItemReportPostGroup = ({item,refGroup}) => {
  const [usersReport, setUsersReport] = useState([]);
  console.log('item',item);
  const ref = refGroup.collection('posts').doc(item.id);
  useEffect(() => {
    item?.report.forEach(item => {
      firestore()
        .collection('users')
        .doc(item)
        .get()
        .then(doc => {
          setUsersReport(usersReport => [
            ...usersReport,
            doc.data()?.displayName,
          ]);
        });
    });
  }, []);
  const handleOnRemovePost = () => {
    ref
      .collection('comments')
      .get()
      .then(querySnapshot => {
        Promise.all(querySnapshot.docs.map(item => item.ref.delete())).then(
          () => {
            ref.delete().then(() => {
              ToastAndroid.show('Xóa bài viết thành công', ToastAndroid.SHORT);
            });
          },
        );
      });
  };
  const handleOnClickBtnRemove = () => {
    Alert.alert(
      'Xóa bài viết',
      'Bạn có chắc chắn muốn xóa bài viết này?',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Xóa', onPress: () => handleOnRemovePost()},
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.itemReportPost}>
      <View style={styles.itemReportPostHeader}>
        {usersReport?.length == 1 && (
          <Text style={styles.nameUserReport}>
            {usersReport[0] || 'Ai đó'}{' '}
          </Text>
        )}
        {usersReport?.length > 1 && (
          <Text style={styles.nameUserReport}>
            {usersReport[0] || 'Ai đó'} và {usersReport.length - 1} người khác{' '}
          </Text>
        )}
        <Text style={{fontSize: 16}}>đã báo cáo bài viết này.</Text>
      </View>
      <ContentPost item={item} />
      <View style={styles.btnChoice}>
        <TouchableOpacity
          style={styles.btnChoiceItem}
          onPress={() => {
            ref.update({
              report: [],
            });
          }}>
          <Text style={styles.btnChoiceItemText}>Giữ lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnChoiceItem}
          onPress={() => {
            handleOnClickBtnRemove();
          }}>
          <Text style={styles.btnChoiceItemText}>Gỡ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemReportPostGroup;

const styles = StyleSheet.create({
  itemReportPost: {},
  itemReportPostHeader: {
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 6,
    borderTopColor: '#e6e6e6',
    borderBottomWidth: 6,
    borderBottomColor: '#e6e6e6',
  },
  nameUserReport: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnChoice: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnChoiceItem: {
    flex: 1,
    marginHorizontal: 20,
    padding: 10,
    paddingVertical: 6,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
  },
  btnChoiceItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
