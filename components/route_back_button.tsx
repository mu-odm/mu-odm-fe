import { Button } from "./ui/button"

export default function RouteBackButton() {

    const routeBackHandler = () => {
        window
          .history
          .back()
      }

    return (
        <Button variant="outline" type="button" onClick={() => routeBackHandler()}>Back</Button>
    )
}