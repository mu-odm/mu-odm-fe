import { Button } from "./ui/button"

export default function RouteBackButton() {

    const routeBackHandler = () => {
        window
          .history
          .back()
      }

    return (
        <Button variant="outline" onClick={() => routeBackHandler()}>Back</Button>
    )
}