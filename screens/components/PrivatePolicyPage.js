import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import s from "../styles/css";
import { color } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const PrivatePolicyPage = () => {
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      <StatusBar style={"dark"}></StatusBar>
      {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
      <View style={s.headContainer}>
        <TouchableOpacity
          style={s.headBtn}
          onPress={() => {
            navigation.navigate("AppInformationPage");
          }}
        >
          <Image
            style={{
              width: 8,
              height: 14,
            }}
            source={require("../images/backBtn.png")}
          />
        </TouchableOpacity>
        <Text style={s.title}>개인정보 정책</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          Check Team Mate는 정보주체의 자유와 권리 보호를 위해 「개인정보
          보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를
          처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에
          따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와
          관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과
          같이 개인정보 처리방침을 수립·공개합니다. 개인정보의 처리목적 Check
          Team Mate는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
          개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
          변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는
          등 필요한 조치를 이행할 예정입니다. 회원 가입 및 관리 회원 가입의사
          확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리,
          서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시
          법정대리인의 동의여부 확인, 각종 고지·통지 목적으로 개인정보를
          처리합니다. 서비스 제공 서비스 제공, 콘텐츠 제공, 서비스 운영 및
          유지보수를 위한 통계 자료 도출의 목적으로 개인정보를 처리합니다.
          개인정보의 처리 및 보유기간 ① Check Team Mate는 법령에 따른 개인정보
          보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은
          개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. ② 각각의
          개인정보 처리 및 보유 기간은 다음과 같습니다. 앱 회원 가입 및 관리 :
          사업자/단체 앱 탈퇴 시까지 다만, 다음의 사유에 해당하는 경우에는 해당
          사유 종료 시까지 관계 법령 위반에 따른 수사·조사 등이 진행 중인
          경우에는 해당 수사·조사 종료 시까지 처리하는 개인정보 항목 Check Team
          Mate는 다음의 개인정보 항목을 처리하고 있습니다. 회원 가입 및 관리 •
          필수항목 : 이름/닉네임, 이메일주소 • 선택항목 : 학교 이름, 학번,
          전화번호 서비스 제공 • 필수항목 : 이름/닉네임, 이메일주소• 선택항목 :
          학교 이름, 학번, 전화번호 정보주체의 권리, 의무 및 행사 회원은
          언제든지 서비스 내부 [설정]에서 자신의 개인정보를 조회하거나 수정,
          탈퇴 할 수 있으며, Check Team Mate 이메일(?)을 통해
          열람/정정/삭제/처리정지 요구 등의 권리를 행사할 수 있습니다.
          개인정보의 파기 절차 및 방법 ① Check Team Mate는 개인정보 보유기간의
          경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이
          해당 개인정보를 파기합니다.② 정보주체로부터 동의받은 개인정보
          보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에
          따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의
          데이터 베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다. ③
          개인정보 파기의 절차 및 방법은 다음과 같습니다. 파기절차 Check Team
          Mate는 파기 사유가 발생한 개인정보를 선정하고, Check Team Mate의 개인
          정보 보호책임자의 승인을 받아 개인정보를 파기합니다. 파기방법 Check
          Team Mate는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수
          없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로
          분쇄하거나 소각하여 파기합니다. 미이용자의 개인정보 파기 등에 관한
          조치 ① Check Team Mate는 1년간 서비스를 이용하지 않은 이용자의 정보를
          파기하고 있습니다. 다만, 다른 법령에서 정한 보존기간이 경과할 때까지
          다른 이용자의 개인정보와 분리하여 별도로 저장·관리할 수 있습니다. ②
          Check Team Mate는 개인정보의 파기 30일 전까지 개인정보가 파기되는
          사실, 기간 만료일 및 파기되는 개인정보의 항목을 이메일, 문자 등
          이용자에게 통지 가능한 방법으로 알리고 있습니다. ③ 개인정보의 파기를
          원하지 않으시는 경우, 기간 만료 전 서비스 로그인을 하시면 됩니다.
          개인정보 열람청구 정보주체는 「개인정보 보호법」 제35조에 따른
          개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. Check Team Mate는
          정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다. ‣
          개인정보 열람청구 접수·처리 부서 담당자 : Check Team Mate 연락처 :
          권익침해 구제방법 ① 정보주체는 개인정보침해로 인한 구제를 받기 위하여
          개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
          분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의
          신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
          개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
          개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr) 대검찰청 :
          (국번없이) 1301 (www.spo.go.kr) 경찰청 : (국번없이) 182
          (ecrm.cyber.go.kr) ② Check Team Mate는 정보주체의 개인정보자기결정권을
          보장하고, 개인정보침해로 인한 상담 및 피해 구제를 위해 노력하고
          있으며, 신고나 상담이 필요한 경우 아래의 담당부서로 연락해 주시기
          바랍니다. ‣ 개인정보보호 관련 고객 상담 및 신고 담당자 : Check Team
          Mate 연락처 : ③ 「개인정보 보호법」 제35조(개인정보의 열람),
          제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에
          의한 요구에 대 하여 공공기관의 장이 행한 처분 또는 부작위로 인하여
          권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라
          행정심판을 청구할 수 있습니다. ‣ 중앙행정심판위원회 : (국번없이) 110
          (www.simpan.go.kr) 개인정보의 안전성 확보조치 Check Team Mate는
          개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
          관리적 조치 : 내부관리계획 수립·시행, 정기적 교육 기술적 조치 :
          개인정보처리시스템 등의 접근권한 관리, 개인정보의 암호화, 보안프로그램
          설치 및 갱신
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivatePolicyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  text: {
    fontSize: 13,
    fontFamily: "SUIT-Regular",
    color: color.activated,
  },
});
