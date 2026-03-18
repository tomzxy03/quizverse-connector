1. Cơ chế Lưu đáp án (Answer Saving)
1.1 Auto-save khi chọn đáp án

Client phải tự động lưu đáp án ngay khi người dùng thao tác.

Trigger:

Radio → click option

Checkbox → thay đổi lựa chọn

Text → debounce

Flow:

User click option
      ↓
Update Local Store
      ↓
Call API saveAnswer
      ↓
Server lưu vào Redis

API:

POST /instances/{instanceId}/answers

Payload:

{
  "questionId": 12,
  "answers": [1,3]
}

⚠️ Luôn gửi toàn bộ danh sách answers hiện tại, không gửi delta.

Ví dụ:

Correct:
answers: [1,3]

Incorrect:
add:3
remove:1

Điều này giúp tránh race condition khi user click nhanh.

1.2 Debounce cho câu hỏi Text

Đối với câu hỏi tự luận:

debounce 500ms – 1000ms

Ví dụ:

User typing
↓
wait 800ms
↓
saveAnswer()

Mục tiêu:

giảm spam API

vẫn autosave realtime

1.3 Sync Status (Trạng thái lưu)

UI phải hiển thị trạng thái đồng bộ.

State	Icon	Meaning
saving	⏳	đang gửi
saved	✓	đã lưu
error	⚠	lỗi

Flow:

click answer
↓
saving
↓
API success
↓
saved

Nếu lỗi:

saving
↓
error
↓
retry queue
2. Quản lý trạng thái Local

Client phải duy trì state để:

giảm API calls

xử lý offline

phục hồi khi refresh

2.1 Store

Sử dụng:

Redux

Zustand

React Store / Signals

Structure:

{
  "instanceId": 55,
  "answers": {
    "1": [2],
    "2": [1,3],
    "3": [0]
  },
  "syncStatus": {
    "1": "saved",
    "2": "saving"
  }
}
2.2 Backup LocalStorage

Store nên backup vào:

localStorage

Key:

quiz-instance-{instanceId}

Ví dụ:

{
  "answers":{
    "1":[2],
    "2":[1,3]
  }
}

Mục đích:

browser crash

mất điện

refresh

3. Resume khi Refresh

Khi user reload:

Step 1

Load localStorage

restore answers

UI hiển thị ngay lập tức.

Step 2

Call API:

GET /instances/{id}/state

Server trả về:

{
 "remainingSeconds": 1100,
 "userAnswers":[]
}
Step 3

Sync:

server answers → overwrite local
4. Countdown Timer

Client không được tự tính thời gian hoàn toàn.

Server là nguồn thời gian chuẩn.

Server trả:

remainingSeconds

Client:

start countdown
5. Heartbeat (Time Sync)

Cứ mỗi:

30 – 60 seconds

Client gọi API nhẹ:

GET /instances/{id}/state

hoặc nhận từ response của:

saveAnswer

Server trả:

{
 "remainingSeconds": 1035
}

Client điều chỉnh timer nếu lệch.

6. Offline Handling

Client phải xử lý khi mất mạng.

6.1 Retry Queue

Nếu saveAnswer fail:

push into queue

Queue:

[
 {questionId:1,answers:[2]},
 {questionId:2,answers:[1,3]}
]
6.2 Retry khi có mạng

Detect:

window.addEventListener("online")

Flow:

network restored
↓
flush retry queue
6.3 Warning cho user

Nếu retry fail nhiều lần:

"Connection unstable. Latest answer may not be saved."
7. Layout UI

Recommended layout:

----------------------------------
Timer
----------------------------------
Sidebar | Question Content
----------------------------------
Sidebar (Question Grid)

Hiển thị tất cả câu hỏi.

Color state:

Color	Meaning
gray	chưa làm
blue	đã lưu
yellow	đang lưu
red	lỗi

Ví dụ:

[1] [2] [3] [4]
[5] [6] [7] [8]
8. Double Tab Protection

User không nên mở quiz ở nhiều tab.

Client nên detect:

localStorage

Flow:

Tab1 open
↓
set quiz-active-tab
↓
Tab2 open
↓
detect existing
↓
show warning
9. Submit Quiz

Submit có thể xảy ra:

Manual submit

User click:

Submit
Auto submit

Khi:

remainingSeconds = 0

Client:

lock UI
call submit API
10. Auto Submit khi đóng tab (optional)

Khi tab đóng:

navigator.sendBeacon("/submit")
11. Network Protection

Để tránh request bị ghi đè sai thứ tự.

Client gửi thêm:

{
 "questionId":12,
 "answers":[1,3],
 "clientSeq":17
}

Server chỉ accept nếu:

seq > lastSeq
12. Performance Requirement

Expected load:

60 – 120 concurrent users

Request pattern:

autosave
~1 request / 20s / user

Total:

~5–10 req/sec

Redis + Spring Boot xử lý dễ dàng.

13. Resume Guarantee

Hệ thống phải đảm bảo:

Situation	Expected Behavior
refresh page	resume
browser crash	resume
network loss	retry
tab close	data safe