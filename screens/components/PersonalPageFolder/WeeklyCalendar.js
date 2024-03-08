import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { displayTitleByLocale } from './src/Locale';
import styles from './src/Style';
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal"
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';

export default WeeklyCalendar = ({ getSelectedDate, checkMap, ...props }) => {
    // current date variable
    const [currDate, setCurrDate] = useState(moment(props.selected).locale(props.locale))
    // weekdays variable for setting weekdays
    const [weekdays, setWeekdays] = useState([])
    // weekday labels (일, 월, 화...)
    const [weekdayLabels, setWeekdayLabels] = useState([])
    // selected date for user selection
    const [selectedDate, setSelectedDate] = useState(currDate.clone())
    // variable to refresh calendar
    const [isCalendarReady, setCalendarReady] = useState(false)
    // date variable for today's date
    const [date, setDate] = useState(new Date());
    const [categoryList, setCategoryList] = useState([]);
    // console.log("atasetae", checkMap);
    // modal visibility variable
    const [isModalVisible, setIsModalVisible] = useState(false);
    let rows0 = -1;
    let rows1 = -1;
    let rows2 = -1;
    let rows3 = -1;
    let rows4 = -1;
    let rows5 = -1;
    let rows6 = -1;

    
    
    const email = auth.currentUser.email;
      

    useEffect(() => { // only first mount
        // Create Weekdays
        createWeekdays(currDate);
        // When this is set to true, display calendar
        setCalendarReady(true);
    }, [])

    const toggleModal = () => {
        // toggle the visibility of modal
        setIsModalVisible(!isModalVisible);
      }

    const createWeekdays = (date) => {
        //Array to save weekdays
        setWeekdays([])
        for (let i = 0; i < 7; i++) {
            // props.startWeekday value is 7
            // starting from the first day, set weekdayToAdd as each day of the week
            const weekdayToAdd = date.clone().weekday(props.startWeekday - 7 + i)
            // Update the setWeekdays array by adding weekdayToAdd
            setWeekdays(weekdays => [...weekdays, weekdayToAdd])
            // Label the days (Sun, Mon, Tue, ...)
            setWeekdayLabels(weekdayLabels => [...weekdayLabels, weekdayToAdd.format(props.weekdayFormat)])

        }
    }

    // If user presses back button
    const clickLastWeekHandler = () => {
        // Temporarily close calendar
        setCalendarReady(false)
        // save lastWeekDate to last week date
        const lastWeekCurrDate = currDate.subtract(7, 'days')
        // setCurrDate to lastWeekCurrDate
        setCurrDate(lastWeekCurrDate.clone())
        // SetSelectedDate to first day of the week from last week
        
        // create the weekdays for last week
        createWeekdays(lastWeekCurrDate.clone())
        // enable calendar again
        setCalendarReady(true)
    }

    // Same concept with last week clicker but this time is next week
    const clickNextWeekHandler = () => {
        setCalendarReady(false)
        const nextWeekCurrDate = currDate.add(7, 'days')
        setCurrDate(nextWeekCurrDate.clone())
        
        createWeekdays(nextWeekCurrDate.clone())
        setCalendarReady(true)
    }

    // set year, month, and day depending on users selection
    const isSelectedDate = date => {
        return (selectedDate.year() === date.year() && selectedDate.month() === date.month() && selectedDate.date() === date.date())
    }

    // if user presses on a day
    const onDayPress = (weekday, i) => {
        // set selectedDate to the date user pressed
        getSelectedDate(weekday.clone());
        setSelectedDate(weekday.clone());
        if (props.onDayPress !== undefined) props.onDayPress(weekday.clone(), i)
    }

    // When user selects a date to change from modal
    const onChangeDate = ({type}, selectedDate) => {
        // if user presses a date set new date to selected date
        if(type === "set") {
            setDate(selectedDate);
        } else {
            // close modal
            toggleModal();
        }
    }

    // when user presses confirm on modal
    const confirmDate = () => {
        // set the current date to the selected date
        setCurrDate(moment(date).locale(props.locale));
        // create the entire week to match the selected date
        createWeekdays(moment(date).locale(props.locale));
        // close modal
        toggleModal();
    }
    
    return (
        <View style={{marginTop: "15%"}}>
            <View style={[styles.component, props.style]}>
                <View style={styles.header}>
                    {/* Display title and allow user to press it to change date */}
                    <TouchableOpacity style={{flexDirection: "row"}} onPress={toggleModal} >
                        <Text style={[styles.title, props.titleStyle]}>{isCalendarReady && displayTitleByLocale(props.locale, currDate, props.titleFormat)}</Text>
                        <Entypo name="chevron-small-down" size={30} color="black" style={{marginTop: "-6%"}} />
                    </TouchableOpacity>    
                    
                    {/* Moving to previous dates */}
                    <TouchableOpacity style={{...styles.arrowButton, position: "absolute", right: "10%"}} onPress={clickLastWeekHandler}>
                        <Image
                            style={{
                            width: 8,
                            height: 14,
                            }}
                            source={require("../../images/backBtn.png")}
                        />
                    </TouchableOpacity>
                    {/* Moving to future dates */}
                    <TouchableOpacity style={{...styles.arrowButton, position: "absolute", right: 0}} onPress={clickNextWeekHandler}>
                        <Image
                            style={{
                            width: 8,
                            height: 14,
                            }}
                            source={require("../../images/frontBtn.png")}
                        />
                    </TouchableOpacity>
                </View>

                {/* Modal for selecting dates */}
                <Modal
                    onBackdropPress={() => setIsModalVisible(false)}
                    isVisible={isModalVisible}
                    swipeDirection="down"
                    onSwipeComplete={toggleModal}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={200}
                    animationOutTiming={200}  
                    backdropTransitionInTiming={200} 
                    backdropTransitionOutTiming={0}
                    style={{justifyContent: "flex-end", margin: 0, flex: 1}}
                >
                        {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
                        <View style={s.modalContent}>
                            <View style={s.center} >
                                <View style={{flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                                    {/* Cancel button */}
                                <TouchableOpacity onPress={toggleModal}>
                                    <Text style={{color: "grey", fontSize: 20, marginLeft: "3%", fontFamily: "SUIT-Medium"}}>취소</Text>
                                </TouchableOpacity>
                                {/* bar icon in the top middle of modal */}
                                <View style={s.barIcon}></View>
                                {/* Confirm button */}
                                <TouchableOpacity onPress={confirmDate}>
                                    <Text style={{color: "#007AFF", fontSize: 20, marginRight: "3%", fontFamily: "SUIT-Medium"}}>완료</Text>
                                </TouchableOpacity>
                                </View>
                                {/* Choose date */}
                                <DateTimePicker 
                                    mode="date"
                                    display="spinner"
                                    value={date}
                                    style={styles.timePicker}
                                    onChange={onChangeDate}
                                    textColor='black'
                                />
                            </View>
                        </View>
                </Modal>
                {/* props allow a single component to be different values */}
                <View style={styles.week}>
                    {/* Days of the week label */}
                    <View style={styles.weekdayLabelContainer}>
                        {/* 일요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[0] : ''}</Text>
                        </View>
                        {/* 월요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[1] : ''}</Text>
                        </View>
                        {/* 화요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[2] : ''}</Text>
                        </View>
                        {/* 수요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[3] : ''}</Text>
                        </View>
                        {/* 목요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[4] : ''}</Text>
                        </View>
                        {/* 금요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[5] : ''}</Text>
                        </View>
                        {/* 토요일 */}
                        <View style={styles.weekdayLabel}>
                            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>{weekdays.length > 0 ? weekdayLabels[6] : ''}</Text>
                        </View>
                    </View>
                    {/* Container for the dates under the Week labels */}
                    <View style={styles.weekdayNumberContainer}>
                        {/* Sunday date number */}
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[0], 0)}>
                            {/* if the date selected is a Sunday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[0]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Sunday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[0]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium", }}>
                                    {isCalendarReady ? weekdays[0].date() : ''}
                                </Text>
                            </View>
                         
                            {isCalendarReady && checkMap && checkMap.get(weekdays[0].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[0].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows0 = rows0 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows0 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </TouchableOpacity>
                        {/* Monday date number */}
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[1], 1)} >
                            {/* if the date selected is a Monday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[1]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Monday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[1]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[1].date() : ''}
                                </Text>
                            </View>
   
                            {isCalendarReady && checkMap && checkMap.get(weekdays[1].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[1].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows1 = rows1 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows1 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </TouchableOpacity>
                        {/* Tuesday date number */}
                        <TouchableOpacity style={styles.weekDayNumber}onPress={onDayPress.bind(this, weekdays[2], 2)}>
                            {/* if the date selected is a Tuesday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[2]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Tuesday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[2]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[2].date() : ''}
                                </Text>
                            </View>
                            
                            {isCalendarReady && checkMap && checkMap.get(weekdays[2].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[2].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows2 = rows2 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows2 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </TouchableOpacity>
                        {/* Wednesday date number */}
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[3], 3)}>
                            {/* if the date selected is a Wednesday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[3]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Wednesday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[3]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[3].date() : ''}
                                </Text>
                            </View>
                           
                            {isCalendarReady && checkMap && checkMap.get(weekdays[3].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[3].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows3 = rows3 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows3 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </TouchableOpacity>
                        {/* Thursday date number */}
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[4], 4)}>
                            {/* if the date selected is a Thursday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[4]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Thursday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[4]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[4].date() : ''}
                                </Text>
                            </View>
                            {isCalendarReady && checkMap && checkMap.get(weekdays[4].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[4].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows4 = rows4 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows4 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                                                        
                        </TouchableOpacity>
                        {/* Friday date number */}
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[5], 5)}>
                            {/* if the date selected is a Friday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[5]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Friday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[5]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[5].date() : ''}
                                </Text>
                            </View>
                            
                            {isCalendarReady && checkMap && checkMap.get(weekdays[5].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[5].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows5 = rows5 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows5 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </TouchableOpacity>
                        {/* Saturday date number */}
                        <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekdays[6], 6)}>
                            {/* if the date selected is a Saturday, have the black circle background, else no background */}
                            <View style={isCalendarReady && isSelectedDate(weekdays[6]) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : { } }>
                                {/* if the date selected is a Saturday, set text color to weekDayNumberTextToday (white), else props.themeColor (black) */}
                                <Text style={isCalendarReady && isSelectedDate(weekdays[6]) ? styles.weekDayNumberTextToday : { color: props.themeColor, fontSize: 17, fontFamily: "SUIT-Medium" }}>
                                    {isCalendarReady ? weekdays[6].date() : ''}
                                </Text>
                            </View>
                           
                            {isCalendarReady && checkMap && checkMap.get(weekdays[6].format('YYYY-MM-DD').toString()) !== undefined && (
                                <View style={{ position: "absolute", flexDirection: "row", top: "120%" }}>
                                    {checkMap.get(weekdays[6].format('YYYY-MM-DD').toString()).map((item, index) => {
                                        // this is to simplify calculation by having starting index be set to 1
                                        let count = index + 1;
                                        // this goes for every 5 dots. Once it reaches 5, reset numb back to 1
                                        let numb = 1 + (count - 1) % 5;
                                        // This is the calculation for even disbribution for the dots
                                        let marginLeft = numb <= 5 ? (count <=5 ? (count%6 === 0 ? 0 : 3) : ((count-1)%5 === 0 ? 3 : 11 + 8*(numb-2))) : 0;
                                        // Increment row value by one after every 5th dot
                                        if((count-1)%5 === 0) {
                                            rows6 = rows6 + 1;
                                        }
                                        return (
                                            <View key={item.id} style={{ marginLeft: marginLeft, position: count <= 5 ? "relative" : "absolute", top: count <= 5 ? 0 : 8 * rows6 }}>
                                                <View style={{width: 5, height: 5, borderRadius: 30/2, backgroundColor: item.color}} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
           
        </View>
    )

};

// propTypes define expected types for each prop WeeklyCalendar will use
// helps catches bugs early
// ensures variables receive correct type
WeeklyCalendar.propTypes = {
    /** initially selected day */
    // any means it can be any type
    selected: PropTypes.any,
    /** If firstDay = 1, week starts from Monday. If firstDay = 7, week starts from Sunday. */
    // number type
    startWeekday: PropTypes.number,
    /** Set format to display title (e.g. titleFormat='MMM YYYY' displays "Jan 2020") */
    //string type
    titleFormat: PropTypes.string,
    /** Set format to display weekdays (e.g. weekdayFormat='dd' displays "Mo" and weekdayFormat='ddd' displays "Mon") */
    //string type
    weekdayFormat: PropTypes.string,
    /** Set locale (e.g. Korean='ko', English='en', Chinese(Mandarin)='zh-cn', etc.) */
    // string type
    locale: PropTypes.string,
    /** Set list of events you want to display below weekly calendar. 
     * Default is empty array []. */
    // function type
    onDayPress: PropTypes.func,
    /** Set theme color */
    // string type
    themeColor: PropTypes.string,
    /** Set style of component */
    // any type
    style: PropTypes.any,
    /** Set text style of calendar title */
    // any type
    titleStyle: PropTypes.any,
    /** Set text style of weekday labels */
    // any type
    dayLabelStyle: PropTypes.any
};

// these are the default values for the props
// the code above defines the types of each props
WeeklyCalendar.defaultProps = { // All props are optional
    selected: moment(),
    startWeekday: 7,
    titleFormat: undefined,
    weekdayFormat: 'ddd',
    locale: 'ko',
    onDayPress: undefined,
    themeColor: 'black',
    style: {},
    titleStyle: {},
    dayLabelStyle: {},
};

const s = StyleSheet.create({
    modalContent: {
        backgroundColor: "white",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        minHeight: "20%", // This property determines the minimum height of the modal
        paddingBottom: 20,
      },
      center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      // color of bar on top of modal
      barIcon: {
        width: 60,
        height: 5,
        backgroundColor: "#bbb",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
      },
});