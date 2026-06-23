import { Box, Divider, Link, Paper, Typography } from '@mui/material';

function RegisterSpecial() {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant={'h4'}>其他人员注册</Typography>
      </Box>
      <Typography>
        请发送邮件至 <Link href={'mailto:help@dpsast.org'}>help@dpsast.org</Link> 请求人工创建账号。
      </Typography>
      <Typography>邮件模板如下：</Typography>
      <Paper sx={{ margin: 1 }}>
        <Box sx={{ padding: 2 }}>
          <Typography>
            Subject：<b>科协 Gitea 账户注册申请</b>
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: 2 }}>
          <Typography>姓名：</Typography>
          <Typography>毕业年份：</Typography>
          <Typography>用户名：</Typography>
          <Typography>临时密码：（无需担心隐私泄露，第一次登录时依然会要求你修改密码）</Typography>
          <Typography>注册理由：（例如，是“饥渴乐园”老坛友）</Typography>
        </Box>
      </Paper>
      <Typography>
        我们将会把您发送邮件时所用的邮箱作为 Gitea 账号的邮箱。审核通过后，我们会进行回复，请注意查收邮件。
      </Typography>
    </>
  );
}

export default RegisterSpecial;
