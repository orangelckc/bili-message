import SampleA from '@/components/Danmu/SampleA.vue'
import SampleB from '@/components/Danmu/SampleB.vue'

export const danmaku: IMsg = {
  id: 'Sp96GuKWs9ZbUGa6JrK7H',
  type: 'message',
  uname: '用户昵称',
  isSafe: true,
  message: '测试弹幕<img style="width: 20px; height: 20px;" src="http://i0.hdslb.com/bfs/live/816402551e6ce30d08b37a917f76dea8851fe529.png" />',
  time: '00:00:29',
  uface: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABgAGADAREAAhEBAxEB/8QAGwABAQADAQEBAAAAAAAAAAAAAAQCAwUBBgf/xAA5EAABAwIDBAQMBgMAAAAAAAABAAIDBBEFEiETMVFxIkFhwRQVMjVCUlNygZKx4SRDc4KRoTM00f/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAZEQEBAQEBAQAAAAAAAAAAAAAAEQEhQTH/2gAMAwEAAhEDEQA/AP2hdGRAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEEzq6BlWKZxIeQNSNEKpQEExroBVtpsxMh00GgPBCqUBAQEBAQeOc1jS5xAaBck9SCE4rCSckU0jfWazQolSV08VZH/AK1Q2UeS7J/RQ1lR4jNFFs6iCZ9vJcG627UM1lU4nK+Etp6eZrj6Tm7uSFaKCWOkBe+nqHzHe7Ju5ImLhisQ1fBOxvrFmgRatY9sjA9jg5p1BCKyQEBAQc7E3Fz6an9GWTpdoRNVNY55cBI+NjDla1htuRWWwPt5/n+yBsD7ef5/sgbE+3n+f7IGxPt5/n+yDF7XxWdtHvaXBrmvN7g6IJaA7Ktq6YaMa7M0cLomOiiiAgIObiHnCh9/vCJq6H8z9RyKwnrKen0llAPqjU/whSmqoquMvivYGxBFkCqqo6SISSAkE2AAQYwV9NUEBkgzeq7QoVsn0i/c36hBFS+eqzkO5E9dJFEBAQc2v84UPvH6hE1UGGSGoY1xaXPcA4dSKjhwWJpvNI6Q8BoESOgwRQtMbMjA0XLRpYcUV67ZSjI7I8OFw063HFBBNg0DyTE50R4bwiRU6MxUjIy4vLS0ZjvOoRU1N56rOQ7kTProoogICDm1+mIUJO7Oe5E1bD+b+oUVtQapaeKYgyMuRpvtpw5IEVPDCSY2BpPX2cOSDag1T/4h77fqEEdNrjNZ7oRPXRRRAQEEtdTOqIWmMgSxuzMJ48ENSHEA0nawVEUvpBg0P8oleHE42i58LA4kD/iFPGcdrnwu3GzUKeNI7X/F242CFBicbhceFkdgCFejEGOIyw1Urx5LXAWv8EKqoad8TZJZrbaU5nAdXYi4rQEBAQEBBxMbqM0jKcHRozO59SJrU6tz4MICemHBn7d6JeArcmDCAO6bnFnJu/vQvGeC1JjndA49GTUc0XHdRRAQEBAQEHhIAJO4C5QfJzymeoklPpOv8EZa0BBkx5je17d7SCEH1kUgmiZI3c4AhGmaAgICAgII8Tl2VBJY6u6I+KGvmkYEUQEHfwWbPSOjO+N39FFx0kUQEH//2Q==',
}

export const demos = [
  {
    name: '样例1',
    id: 'A',
    component: SampleA,
    baseStyle: {
      avatarSize: 100,
      unameColor: 'rgba(255, 255, 255, 0.8)',
      unameFontSize: 16,
      msgColor: 'rgba(255, 255, 255, 0.9)',
      msgFontSize: 20,
      msgBackground: 'rgba(0, 0, 0, 0.5)',
      showMedal: false,
    },
  },
  {
    name: '样例2',
    id: 'B',
    component: SampleB,
    baseStyle: {
      unameColor: 'rgba(255, 255, 255, 0.8)',
      unameFontSize: 16,
      msgColor: 'rgba(255, 255, 255, 0.9)',
      msgFontSize: 20,
      msgBackground: '0, 0, 0',
      showMedal: false,
    },
  },
]
