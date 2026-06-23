import { Box, Button, Link, Typography } from '@mui/material';

function Landing() {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant={'h4'}>饥渴 ID 平台</Typography>
      </Box>
      <Typography>
        若要访问物理系学生科协所维护的资源（如<Link href={'https://wiki.dpsast.org/'}>维饥百渴</Link>
        ），请先注册饥渴 ID。
      </Typography>
      <Typography>
        清华大学在读学生请点击下面的“在校学生注册”进入注册流程。我们将会先将你重定向到 Tsinghua
        Git，请在那里先登录，登录完毕后，你将回到注册页面。我们需要获取你的<b>真实姓名、学号、学生邮箱</b>
        以确认你的身份。除此之外，不会读取任何其他信息。
      </Typography>
      <Typography>
        原则上，我们只允许清华大学物理系与致理书院物理方向的同学注册，记录在册的新生会自动通过审核。如果审核没有自动通过，亦或是其他院系的同学有注册意愿，请填写你的院系和注册理由。
      </Typography>
      <Typography>
        如果你不再拥有清华大学电子身份（例如，已经从清华大学毕业），不用担心！请发送邮件联系我们，详见
        <Link href={'/register-special'}>其他人员注册</Link>。
      </Typography>
      <Button size={'large'} variant={'contained'} sx={{ alignSelf: 'center' }} href={'/api/register/fire'}>
        在校学生注册
      </Button>
    </>
  );
}

export default Landing;
