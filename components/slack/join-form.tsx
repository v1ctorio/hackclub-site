
import { getCookie, hasCookie } from 'cookies-next'
import {
  Box,
  Card,
  Grid,
  Input,
  Label,
  Link,
  Select,
  Text,
  Textarea
} from 'theme-ui'
import useForm from '../../lib/use-form'
import Submit from '../submit'

import { withRouter } from 'next/router'
interface Fields {
  first_name?: string;
  last_name?: string;
  email?: string;
  reason?: string;
}
const JoinForm = ({ sx = {}, router }) => {
  const useWaitlist = process.env.NEXT_PUBLIC_OPEN !== 'true'

  const { status, formProps, useField, data } = useForm('/api/join/', null, {
    clearOnSubmit: 60000,
    method: 'POST',
    bearer: undefined,
    initData: hasCookie('continent')
      ? {
        continent: getCookie('continent'),
        reason: router.query.reason,
        event: router.query.event
      }
      : { reason: router.query.reason, event: router.query.event }
  })
  const typedData = data as Fields

  const eventReferrer = (data as any).event

  const isAdult = (data as any).year === 'tertiary'
  const couldBeUnder13 = (data as any).year === "middle"
  
  
  return (
    <Card sx={{ maxWidth: 'narrow', mx: 'auto', '& label': { mb: 3 }, ...sx }}>
      <form {...formProps}
      onSubmit={event=>{
        const params = new URLSearchParams({
          "first_name": typedData.first_name,
          "last_name": typedData.last_name,
          "email": typedData.email
        }).toString()
        event.preventDefault()
        window.location.assign("https://auth.hackclub.com/slack?"+params)
      }}
      >
        {eventReferrer && (
          <Box
            sx={{
              bg: 'purple',
              color: 'white',
              p: 2,
              mb: 3,
              borderRadius: 5,
              textAlign: 'center'
            }}
          >
            <Text variant="headline" sx={{ fontSize: 3 }}>
              {eventReferrer === 'onboard'
                ? "We can't wait to see your PCB!"
                : `We can't wait to see you at ${eventReferrer}!`}
            </Text>

            <br />
            <Text variant="subtitle" sx={{ fontSize: 2 }}>
              <i> In the meantime, we'll be hanging around in the Slack </i>
            </Text>
          </Box>
        )}
        <Grid columns={[2, 2]} gap={1} sx={{ columnGap: 2 }}>
          <Label>
            First name
            <Input
              {...useField('first_name')}
              placeholder="Fiona"
              required
              id="joiner_first_name"
            />
          </Label>
          <Label>
            Last name
            <Input
            {...useField('last_name')}
            placeholder='Hackworth'
            required
            id='joiner_last_name'/>
              
          </Label>
          <Label sx={{ width: '100%' }}>
            Email address
            <Input
              {...useField('email')}
              placeholder="fiona@hackclub.com"
              required
            />
          </Label>
          <Label>
            School level
            <Select
              {...useField('year')}
              required
              sx={{ color: (data as any).continent === '' ? 'muted' : '' }}
            >
              <option value="" selected disabled hidden>
                Select a level...
              </option>
              <option value="middle">Middle School</option>
              <option value="high">High School</option>
              <option value="tertiary">Tertiary Education (18+)</option>
            </Select>
          </Label>
        </Grid>
        <Label>
          How did you hear about us/the Slack? What are you most looking forward to?
          <Textarea
            {...useField('reason')}
            placeholder="I heard about Hack Club from..."
            required
          />
        </Label>
        {couldBeUnder13 && (
          <Text
            variant="caption"
            color="secondary"
            as="div"
            sx={{ maxWidth: '600px', textAlign: 'left', mb: 2 }}
          >
            Heads up, Hack Club is <b>only for teenagers over 13</b>.<br/>
            If you're under 13, we'll be waiting for you on your birthday!
          </Text>
        )}

        {isAdult && (
          <Text
            variant="caption"
            color="secondary"
            as="div"
            sx={{ maxWidth: '600px', textAlign: 'left', mb: 2 }}
          >
            Hold your horses! <b>Our Slack community is for minors</b>! You can still participate in our referral program, {" "}
            <Link href='https://pyramid.hackclub.com/' sx={{whiteSpace: "nowrap"}}>Pyramid Scheme</Link>. Or check out our partner organization, {" "}
            <Link href='https://education.github.com/' sx={{whiteSpace: "nowrap"}}>GitHub Education</Link>).
          </Text>
        )}
        <Box>
          <Submit
            status={status}
            mt={'0px!important'}
            sx={{}}
            labels={{
              default: useWaitlist ? 'Join Waitlist' : 'Join Now',
              error: 'Something went wrong',
              success: useWaitlist
                ? "You're on the Waitlist!"
                : 'Check your email for invite!'
            }}
            disabled={status === 'loading' || status === 'success' || isAdult}
          />
          {status === 'success' && !useWaitlist && (
            <Text
              variant="caption"
              color="secondary"
              as="div"
              sx={{
                maxWidth: '600px',
                textAlign: 'center',
                mt: 3
              }}
            >
              Search for "Slack" in your mailbox! Not there?{' '}
              <Link href="mailto:slack@hackclub.com" sx={{ ml: 1 }}>
                Send us an email
              </Link>
            </Text>
          )}
        </Box>
      </form>
    </Card>
  )
}

export default withRouter(JoinForm as any)
