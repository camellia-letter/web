import {
  Button,
  Card,
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArchive,
  IconCalendarEvent,
  IconCamera,
  IconGripVertical,
  IconLink,
  IconMapPin,
  IconMessage,
  IconMessageShare,
  IconPalette,
  IconPhoto,
  IconRoute,
  IconWallet,
} from "@tabler/icons-react";
import Link from "next/link";
import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    title: '순서 변경',
    description:
      '보여주고 싶은 내용을 원하는 순서대로 배치할 수 있어요. 드래그로 간편하게 이동하고 실시간 미리보기로 확인하세요.',
    icon: <IconGripVertical size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 100%)',
    iconGradient: { from: 'pink', to: 'grape' },
  },
  {
    title: '12가지 테마',
    description:
      '클래식부터 모던, 계절별 테마까지. 5가지 폰트와 커스텀 색상으로 나만의 스타일을 만드세요.',
    icon: <IconPalette size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)',
    iconGradient: { from: 'blue', to: 'indigo' },
  },
  {
    title: '평생소장',
    description:
      '예식 후에도 청첩장을 계속 보관할 수 있어요. 방명록 내용도 보존되며, 소중한 사람들의 추억은 제가 책임져요.',
    icon: <IconArchive size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)',
    iconGradient: { from: 'yellow', to: 'pink' },
  },
  {
    title: '예식장소',
    description:
      '예식장까지 정확하게 안내해줘요. 네이버지도, 카카오맵 네비게이션을 지원하고 약도 이미지도 첨부할 수 있어요.',
    icon: <IconMapPin size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #fef2f2 0%, #fdf2f8 100%)',
    iconGradient: { from: 'red', to: 'pink' },
  },
  {
    title: '오시는길',
    description:
      '이동수단별로 오시는 길을 안내할 수 있어요. 지하철, 버스 노선 정보를 상세하게 제공하세요.',
    icon: <IconRoute size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    iconGradient: { from: 'teal', to: 'green' },
  },
  {
    title: '계좌번호',
    description:
      '양가 계좌를 깔끔하고 정중하게 보낼 수 있어요. 신랑, 신부측 그룹 분리 표시하고 각각 최대 3개 계좌를 표시할 수 있어요.',
    icon: <IconWallet size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)',
    iconGradient: { from: 'violet', to: 'grape' },
  },
  {
    title: '갤러리',
    description:
      '최대 15장 사진 업로드가 가능해요. 순서 변경 및 썸네일 편집 기능을 제공하고, 확대 방지 기능도 지원해요.',
    icon: <IconPhoto size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
    iconGradient: { from: 'cyan', to: 'blue' },
  },
  {
    title: '모청스냅',
    description:
      '하객들이 찍은 사진을 청첩장으로 받을 수 있어요. 초대장을 받았다면 누구나 업로드 가능하고, 원본 화질로 저장돼요.',
    icon: <IconCamera size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
    iconGradient: { from: 'lime', to: 'cyan' },
  },
  {
    title: '방명록',
    description:
      '초대장을 받은 모든 분들이 남길 수 있어요. 방명록 관리 페이지에서 소중한 메시지를 확인하세요.',
    icon: <IconMessage size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)',
    iconGradient: { from: 'yellow', to: 'orange' },
  },
  {
    title: '예식일시',
    description:
      '캘린더 형태로 예식 날짜를 표시하고, 디데이 카운트도 함께 보여줘요. 특별한 날이 얼마나 남았는지 한눈에 확인하세요.',
    icon: <IconCalendarEvent size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)',
    iconGradient: { from: 'orange', to: 'red' },
  },
  {
    title: '카카오톡 초대장 설정',
    description:
      '초대장 썸네일, 제목, 설명을 편집할 수 있어요. 버튼 표시 및 기능 설정으로 카카오톡 공유를 최적화하세요.',
    icon: <IconMessageShare size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
    iconGradient: { from: 'yellow', to: 'yellow' },
  },
  {
    title: 'URL 커스텀 설정',
    description:
      '원하는 URL로 청첩장 주소를 설정할 수 있어요. 기억하기 쉽고 의미있는 주소로 특별함을 더하세요.',
    icon: <IconLink size={24} stroke={1.8} />,
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)',
    iconGradient: { from: 'indigo', to: 'violet' },
  },
];

const Home = async () => {
  const session = await auth();

  return (
    <>
      <Header variant="landing" session={session} />

      <Flex component="main" direction="column" pt="4rem">
        <Flex
          component="section"
          align="center"
          justify="center"
          px="md"
          py="6rem"
          style={{
            minHeight: 'calc(100vh - 4rem)',
            background: 'linear-gradient(135deg, #fff1f2 0%, #f5f3ff 45%, #eff6ff 100%)',
          }}
        >
          <Container size="xl">
            <Stack gap="xl" align="center">
              <Stack gap="lg" align="center" maw="47.5rem">
                <Title order={1} ta="center" size="clamp(2.5rem, 7vw, 4rem)">
                  세상에 하나뿐인,
                  <br />
                  <Text
                    span
                    inherit
                    variant="gradient"
                    gradient={{ from: 'pink', to: 'grape', deg: 135 }}
                  >
                    우리의 청첩장
                  </Text>
                </Title>
                <Text size="lg" c="dimmed" ta="center" maw="40rem">
                  원하는 섹션만 골라
                  <br />
                  당신만의 이야기를 만들어보세요.
                  <br />
                  여러분의 특별한 순간을
                  <br />더 특별하게 만들어드립니다.
                </Text>
              </Stack>
              {/* 임시로 로그인 버튼 비활성화
              <Button
                component={Link}
                href="/auth/signin"
                radius="xl"
                size="xl"
                variant="gradient"
                gradient={{ from: 'pink', to: 'grape', deg: 135 }}
              >
                우리의 청첩장 만들기
              </Button>
              */}
            </Stack>
          </Container>
        </Flex>

        <Container component="section" id="features" size="xl" py="6rem">
          <Stack gap="3.5rem">
            <Stack gap="sm" align="center">
              <Title order={2} ta="center">
                주요 기능
              </Title>
              <Text size="lg" c="dimmed" ta="center">
                청첩장 제작에 필요한
                <br />
                모든 기능을 제공합니다
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="xl">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  radius="xl"
                  padding="xl"
                  style={{ background: feature.gradient }}
                >
                  <Stack gap="md">
                    <ThemeIcon
                      size="3.25rem"
                      radius="lg"
                      variant="gradient"
                      gradient={{ ...feature.iconGradient, deg: 135 }}
                    >
                      {feature.icon}
                    </ThemeIcon>
                    <Title order={3} size="h4">
                      {feature.title}
                    </Title>
                    <Text c="dimmed">{feature.description}</Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>

        <Paper
          component="section"
          radius={0}
          py="6rem"
          px="md"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}
        >
          <Container size="md">
            <Stack gap="xl" align="center">
              <Stack gap="md" align="center">
                <Title order={2} ta="center" c="white">
                  지금 바로 시작하세요
                </Title>
                <Text size="lg" ta="center" c="rgba(255,255,255,0.9)">
                  회원가입 후 5분 안에 나만의 청첩장을 만들 수 있습니다
                </Text>
              </Stack>
              {/* 임시로 로그인 버튼 비활성화
              <Button
                component={Link}
                href="/auth/signin"
                size="xl"
                radius="xl"
                variant="filled"
                color="dark"
              >
                우리의 청첩장 만들기
              </Button>
              */}
            </Stack>
          </Container>
        </Paper>
      </Flex>

      <Footer />
    </>
  );
};

export default Home;
