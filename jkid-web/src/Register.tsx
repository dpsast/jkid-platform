import {useNavigate, useSearchParams} from "react-router-dom";
import {Box, Button, Grid, Link, TextField, Typography} from "@mui/material";
import ValidatorTextField from "./components/ValidatorTextField.tsx";
import {useState} from "react";

function Register() {
  const [searchParams, /* _setSearchParams */ ] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const base64Payload = searchParams.get("base64Payload");
  if (!base64Payload) return "Something went wrong.";
  const { name, username, studentId, email } = JSON.parse(decodeURIComponent(escape(atob(base64Payload))));

  return <Box height={"100%"} display={"flex"} alignItems={"center"}><Grid container sx={{flexGrow: 1}}>
    <Grid xs={1} md={3}/>
    <Grid xs={10} md={6}>
      <Box display={"flex"} flexDirection={"column"} paddingBottom={2} gap={2}>
        <Box textAlign={"center"}>
          <Typography variant={"h5"}>注册</Typography>
        </Box>

        <Typography>以下的信息是由系统自动生成的，无法修改。</Typography>
        <TextField label={"真实姓名"} value={name} InputProps={{ readOnly: true }}/>
        <TextField label={"学号"} value={studentId} InputProps={{ readOnly: true }}/>
        <TextField label={"用户名"} value={username} InputProps={{ readOnly: true }}/>
        <TextField label={"邮箱"} value={email} InputProps={{ readOnly: true }}/>

        <Typography>
          请设置账户的密码，至少 8 个字符。请注意这是一个<b>临时</b>密码，在审核通过第一次登录时依然会要求你修改密码。<br/>
          <b>建议使用弱密码</b>，以便记忆。<b>不建议使用常用密码</b>，避免隐私泄露。
        </Typography>
        <ValidatorTextField
          label={"密码"}
          type={"password"}
          validator={input => input.length >= 8 ? { isValid: true } : { isValid: false, hint: "密码过短" } }
          setValid={setPasswordValid}
          onValidationPass={setPassword}
        />
        <ValidatorTextField
          label={"确认密码"}
          type={"password"}
          validator={input => input === password ? { isValid: true } : { isValid: false, hint: "两次输入的密码不一致" } }
          setValid={setConfirmed}
        />

        <Button variant={"outlined"} size={"large"} disabled={!(passwordValid && confirmed)} onClick={() => {
          fetch(new URL("/register/submit", import.meta.env.VITE_BACKEND_ADDRESS), {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: searchParams.get("token"),
              password
            })
          }).then(res => res.json()).then(({ status }) => {
            if (status === "pending") {
              navigate("/submitted-pending");
            }
            if (status === "success") {
              navigate("/submitted-success");
            }
          })
        }}>提交</Button>
      </Box>
    </Grid>
    <Grid xs={1} md={3}/>
  </Grid></Box>;
}

function SubmittedPending() {
  return <Box height={"100%"} display={"flex"} alignItems={"center"}><Grid container sx={{flexGrow: 1}}>
    <Grid xs={1} md={3}/>
    <Grid xs={10} md={6}>
      <Typography>感谢你的注册！请等待我们审核。</Typography>
      <Typography>审核通过后，你的学生邮箱将会收到一封邮件。你可以在一段时间后尝试用注册时的用户名和临时密码登录我们的 <Link href={"https://gitea.jkparadise.space/"}>Gitea 平台</Link>。</Typography>
    </Grid>
    <Grid xs={1} md={3}/>
  </Grid></Box>;
}

function SubmittedSuccess() {
  return <Box height={"100%"} display={"flex"} alignItems={"center"}><Grid container sx={{flexGrow: 1}}>
    <Grid xs={1} md={3}/>
    <Grid xs={10} md={6}>
      <Typography>感谢你的注册！你的学号位于我们维护的“自动通过名单”中，因此恭喜你已经拥有了饥渴 ID！</Typography>
      <Typography>欢迎用注册时的用户名和临时密码登录我们的 <Link href={"https://gitea.jkparadise.space/"}>Gitea 平台</Link>！</Typography>
    </Grid>
    <Grid xs={1} md={3}/>
  </Grid></Box>;
}

export default Register;
export { SubmittedPending, SubmittedSuccess };
